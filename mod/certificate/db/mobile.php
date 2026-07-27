<?php
defined('MOODLE_INTERNAL') || die();

$addons = [
    'mod_certificate' => [
        'handlers' => [
            'certificateview' => [
                'delegate'    => 'CoreCourseModuleDelegate', // Intercepts standard course modules
                'method'      => 'mobile_view_certificate',
                'displaydata' => [
                    'icon'  => 'document',
                    'class' => 'mod_certificate',
                ],
            ],
        ],
        'lang' => [
            ['pluginname', 'mod_certificate'],
            ['viewcertificate', 'mod_certificate'],
            ['nocertificatesissued', 'mod_certificate'],
        ],
    ],
];