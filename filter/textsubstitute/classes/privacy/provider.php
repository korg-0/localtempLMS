<?php
namespace filter_textsubstitute\privacy;

defined('MOODLE_INTERNAL') || die();

/**
 * Privacy API Subsystem implementation for the Text Substitute filter.
 *
 * @package    filter_textsubstitute
 * @copyright  2026 Your Name <your.email@example.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class provider implements \core_privacy\local\metadata\null_provider {

    /**
     * Get the language string identifier within the component's language file
     * to explain exactly why this plugin stores no personal user data.
     *
     * @return string Language string identifier key.
     */
    public static function get_reason(): string {
        return 'privacy:metadata';
    }
}
