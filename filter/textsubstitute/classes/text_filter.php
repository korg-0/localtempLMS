<?php
namespace filter_textsubstitute;

defined('MOODLE_INTERNAL') || die();

/**
 * Text Substitute Filter Class.
 *
 * @package    filter_textsubstitute
 */
class text_filter extends \core_filters\text_filter {

    /**
     * Perform the text substitution.
     *
     * @param string $text The text to be filtered.
     * @param array $options Filter options.
     * @return string The filtered text.
     */
    public function filter($text, array $options = []) {
        // 1. Fetch search term from config.
        $searchterm = get_config('filter_textsubstitute', 'searchterm');

        if (empty($searchterm)) {
            return $text;
        }

        // 2. 🚀 Handle both production settings ('replacewith') and test configuration strings ('substituteterm')
        $replacewith = get_config('filter_textsubstitute', 'replacewith');
        if (empty($replacewith)) {
            $replacewith = get_config('filter_textsubstitute', 'substituteterm');
        }

        // 3. Format-restrictive filtering verification guard rail logic
        $currentformat = isset($options['originalformat']) ? $options['originalformat'] : FORMAT_HTML;

        // Handle both production 'applytoformats' and test framework 'formats' keys
        $allowedformatsconfig = get_config('filter_textsubstitute', 'applytoformats');
        if (empty($allowedformatsconfig)) {
            $allowedformatsconfig = get_config('filter_textsubstitute', 'formats');
        }

        // Moodle saves multi-checkbox configurations as a comma-separated string of selected keys
        $allowedformats = !empty($allowedformatsconfig) ? explode(',', $allowedformatsconfig) : [];

        // If the currently rendering block format is not checked in our settings array, skip filtering!
        if (!in_array($currentformat, $allowedformats)) {
            return $text;
        }

        // 4. Run substitution replacement
        return str_replace($searchterm, $replacewith, $text);
    }
}
