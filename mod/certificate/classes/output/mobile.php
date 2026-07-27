<?php
namespace mod_certificate\output;

defined('MOODLE_INTERNAL') || die();

class mobile {

    /**
     * Renders the native mobile certificate dashboard view
     */
    public static function mobile_view_certificate($args) {
        global $OUTPUT, $DB, $USER;

        $args = (object) $args;
        $cmid = $args->cmid; // Course module ID passed by the app framework

        // Get the specific certificate instance info
        $cm = get_coursemodule_from_id('certificate', $cmid, 0, false, MUST_EXIST);
        $certificate = $DB->get_record('certificate', ['id' => $cm->instance], '*', MUST_EXIST);

        // Fetch any certificates already issued to this specific user
        $issued = $DB->get_records('certificate_issue', [
            'certificateid' => $certificate->id,
            'userid'        => $USER->id
        ], 'timecreated DESC');

        $data = [
            'certificate' => $certificate,
            'issued'      => array_values($issued),
            'has_issued'  => !empty($issued)
        ];

        return [
            'templates' => [
                [
                    'id'   => 'main',
                    'html' => $OUTPUT->render_from_template('mod_certificate/mobileapp/mobile_view', $data),
                ],
            ],
        ];
    }
}