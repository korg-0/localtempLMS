<?php
/**
 * Settings for the Text Substitute filter.
 *
 * @package    filter_textsubstitute
 */

defined('MOODLE_INTERNAL') || die();

if ($settings) {
    // 1. Search Term
    $settings->add(new admin_setting_configtext(
        'filter_textsubstitute/searchterm',
        get_string('searchterm', 'filter_textsubstitute'),
        get_string('searchterm_desc', 'filter_textsubstitute'),
        'Moodle',
        PARAM_RAW
    ));

    // 2. Replacement Text
    $settings->add(new admin_setting_configtext(
        'filter_textsubstitute/replacewith',
        get_string('replacewith', 'filter_textsubstitute'),
        get_string('replacewith_desc', 'filter_textsubstitute'),
        'Uni-Learn',
        PARAM_RAW
    ));
    // Generates a list of core Moodle formats: HTML, MOODLE, PLAIN, MARKDOWN
    $formats = [
        FORMAT_HTML => 'HTML format',
        FORMAT_MOODLE => 'Moodle auto-format',
        FORMAT_PLAIN => 'Plain text format',
        FORMAT_MARKDOWN => 'Markdown format'
    ];

    $settings->add(new admin_setting_configmulticheckbox(
        'filter_textsubstitute/applytoformats',
        get_string('applytoformats', 'filter_textsubstitute'),
        get_string('applytoformats_desc', 'filter_textsubstitute'),
        [FORMAT_HTML => 1], // Default check HTML format out of the box
        $formats
    ));
}
