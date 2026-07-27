angular.module('mm.addons.mod_certificate', [])
.constant('mmaModCertificateComponent', 'mmaModCertificate')
.config(["$stateProvider", function($stateProvider) {
    $stateProvider
    .state('site.mod_certificate', {
        url: '/mod_certificate',
        params: {
            module: null,
            courseid: null
        },
        views: {
            'site': {
                controller: 'mmaModCertificateIndexCtrl',
                templateUrl: '$ADDONPATH$/templates/index.html'
            }
        }
    });
}])
.config(["$mmCourseDelegateProvider", "$mmContentLinksDelegateProvider", function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModCertificate', 'certificate', '$mmaModCertificateHandlers.courseContent');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModCertificate', '$mmaModCertificateHandlers.linksHandler');
}]);

angular.module('mm.addons.mod_certificate')
.controller('mmaModCertificateIndexCtrl', ["$scope", "$stateParams", "$mmaModCertificate", "$mmUtil", "$q", "$mmCourse", function($scope, $stateParams, $mmaModCertificate, $mmUtil, $q, $mmCourse) {
    var module = $stateParams.module || {},
        courseId = $stateParams.courseid,
        certificate;
    $scope.title = module.name;
    $scope.description = module.description;
    $scope.courseid = courseId;
    function fetchCertificate(refresh) {
        return $mmaModCertificate.getCertificate(courseId, module.id).then(function(certificateData) {
            certificate = certificateData;
            $scope.title = certificate.name || $scope.title;
            $scope.description = certificate.intro || $scope.description;
            $scope.certificate = certificate;
            if (certificate.requiredtimenotmet) {
                return $q.when();
            }
            return $mmaModCertificate.issueCertificate(certificate.id).finally(function() {
                return $mmaModCertificate.getIssuedCertificates(certificate.id).then(function(issues) {
                    $scope.issues = issues;
                });
            });
        }).catch(function(message) {
            if (!refresh) {
                return refreshAllData();
            }
            if (message) {
                $mmUtil.showErrorModal(message);
            } else {
                $mmUtil.showErrorModal('Error while getting the certificate', true);
            }
            return $q.reject();
        });
    }
    function refreshAllData() {
        var p1 = $mmaModCertificate.invalidateCertificate(courseId),
            certificateRequiredTimeNotMet = typeof(certificate) != 'undefined' && certificate.requiredtimenotmet,
            p2 = certificateRequiredTimeNotMet ? $q.when() : $mmaModCertificate.invalidateIssuedCertificates(certificate.id);
            p3 = certificateRequiredTimeNotMet ? $q.when() : $mmaModCertificate.invalidateDownloadedCertificates(module.id);
        return $q.all([p1, p2, p3]).finally(function() {
            return fetchCertificate(true);
        });
    }
    $scope.openCertificate = function() {
        var modal = $mmUtil.showModalLoading();
        var issuedCertificate = $scope.issues[0];
        $mmaModCertificate.openCertificate(issuedCertificate, module.id)
        .catch(function(error) {
            if (error && typeof error == 'string') {
                $mmUtil.showErrorModal(error);
            } else {
                $mmUtil.showErrorModal('Error while downloading the certificate', false);
            }
        }).finally(function() {
            modal.dismiss();
        });
    };
    fetchCertificate().then(function() {
        $mmaModCertificate.logView(certificate.id).then(function() {
            $mmCourse.checkModuleCompletion(courseId, module.completionstatus);
        });
    }).finally(function() {
        $scope.certificateLoaded = true;
    });
    $scope.doRefresh = function() {
        refreshAllData().finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
}]);

angular.module('mm.addons.mod_certificate')
.factory('$mmaModCertificate', ["$q", "$mmSite", "$mmFS", "$mmUtil", "$mmSitesManager", "mmaModCertificateComponent", "$mmFilepool", function($q, $mmSite, $mmFS, $mmUtil, $mmSitesManager, mmaModCertificateComponent, $mmFilepool) {
    var self = {};
        self.getCertificate = function(courseId, cmId) {
        var params = {
                courseids: [courseId]
            },
            preSets = {
                cacheKey: getCertificateCacheKey(courseId)
            };
        return $mmSite.read('mod_certificate_get_certificates_by_courses', params, preSets).then(function(response) {
            if (response.certificates) {
                var currentCertificate;
                angular.forEach(response.certificates, function(certificate) {
                    if (certificate.coursemodule == cmId) {
                        currentCertificate = certificate;
                    }
                });
                if (currentCertificate) {
                    return currentCertificate;
                }
            }
            return $q.reject();
        });
    };
        function getCertificateCacheKey(courseId) {
        return 'mmaModCertificate:certificate:' + courseId;
    }
        self.getIssuedCertificates = function(id) {
        var params = {
                certificateid: id
            },
            preSets = {
                cacheKey: getIssuedCertificatesCacheKey(id)
            };
        return $mmSite.read('mod_certificate_get_issued_certificates', params, preSets).then(function(response) {
            if (response.issues) {
                return response.issues;
            }
            return $q.reject();
        });
    };
        function getIssuedCertificatesCacheKey(id) {
        return 'mmaModCertificate:issued:' + id;
    }
        self.invalidateCertificate = function(courseId) {
        return $mmSite.invalidateWsCacheForKey(getCertificateCacheKey(courseId));
    };
        self.invalidateIssuedCertificates = function(id) {
        return $mmSite.invalidateWsCacheForKey(getIssuedCertificatesCacheKey(id));
    };
        self.isPluginEnabled = function(siteId) {
        siteId = siteId || $mmSite.getId();
        return $mmSitesManager.getSite(siteId).then(function(site) {
            return site.wsAvailable('mod_certificate_get_certificates_by_courses');
        });
    };
        self.logView = function(id) {
        if (id) {
            var params = {
                certificateid: id
            };
            return $mmSite.write('mod_certificate_view_certificate', params);
        }
        return $q.reject();
    };
        self.issueCertificate = function(certificateId) {
         var params = {
            certificateid: certificateId
        };
        return $mmSite.write('mod_certificate_issue_certificate', params).then(function(response) {
            if (!response || !response.issue) {
                return $q.reject();
            }
        });
    };
        self.openCertificate = function(issuedCertificate, moduleId) {
        var siteId = $mmSite.getId(),
            revision = 0,
            timeMod = issuedCertificate.timecreated,
            files = [{fileurl: issuedCertificate.fileurl, filename: issuedCertificate.filename, timemodified: timeMod}];
        if ($mmFS.isAvailable()) {
            promise = $mmFilepool.downloadPackage(siteId, files, mmaModCertificateComponent, moduleId, revision, timeMod).then(function() {
                return $mmFilepool.getUrlByUrl(siteId, issuedCertificate.fileurl, mmaModCertificateComponent, moduleId, timeMod);
            });
        } else {
            promise = $q.when($mmSite.fixPluginfileURL(issuedCertificate.fileurl));
        }
        return promise.then(function(localUrl) {
            return $mmUtil.openFile(localUrl);
        });
    };
        self.invalidateDownloadedCertificates = function(moduleId) {
        return $mmFilepool.invalidateFilesByComponent($mmSite.getId(), mmaModCertificateComponent, moduleId);
    };
    return self;
}]);

angular.module('mm.addons.mod_certificate')
.factory('$mmaModCertificateHandlers', ["$mmCourse", "$mmaModCertificate", "$state", "$q", function($mmCourse, $mmaModCertificate, $state, $q) {
    var self = {};
        self.courseContent = function() {
        var self = {};
                self.isEnabled = function() {
            return $mmaModCertificate.isPluginEnabled();
        };
                self.getController = function(module, courseid) {
            return function($scope) {
                $scope.title = module.name;
                $scope.icon = '$ADDONPATH$/icon.gif'
                $scope.class = 'mma-mod_certificate-handler';
                $scope.action = function() {
                    $state.go('site.mod_certificate', {module: module, courseid: courseid});
                };
            };
        };
        return self;
    };
        self.linksHandler = function() {
        var self = {};
                function isEnabled(siteId, courseId) {
            return $mmaModCertificate.isPluginEnabled(siteId).then(function(enabled) {
                if (!enabled) {
                    return false;
                }
                return courseId || $mmCourse.canGetModuleWithoutCourseId(siteId);
            });
        }
                self.getActions = function(siteIds, url, courseId) {
            if (typeof self.handles(url) != 'undefined') {
                return $mmContentLinksHelper.treatModuleIndexUrl(siteIds, url, isEnabled, courseId);
            }
            return $q.when([]);
        };
                self.handles = function(url) {
            var position = url.indexOf('/mod/certificate/view.php');
            if (position > -1) {
                return url.substr(0, position);
            }
        };
        return self;
    };
    return self;
}]);
