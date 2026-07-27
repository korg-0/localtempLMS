<?php
namespace tiny_fontcase;

defined('MOODLE_INTERNAL') || die();

use editor_tiny\plugin_backend;

/**
 * Tiny Font Case plugin initialization backend configuration mapping.
 *
 * @package    tiny_fontcase
 * @copyright  2026 Developer
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class plugin extends plugin_backend implements \editor_tiny\plugin {

    /**
     * Returns the internal unique name of the TinyMCE JavaScript subplugin.
     *
     * @return string
     */
    public static function get_plugin_name(): string {
        return 'fontcase';
    }

    /**
     * Configure options to pass into the TinyMCE initialization wrapper layout.
     * Combines both the toolbar buttons and the Format dropdown menu setup.
     *
     * @param array $options Existing configuration choices.
     * @return array Modified configuration adjustments.
     */
    public static function update_configuration(array $options): array {

        // 1. Inject your lowercase and uppercase actions side-by-side into the core toolbar row layout string
        if (isset($options['toolbar'])) {
            $options['toolbar'] .= ' | tiny_fontcase_lowercase tiny_fontcase_uppercase';
        }

        // 2. Inject your parent menu identifier into the editor's primary top menu 'Format' tree list
        if (isset($options['menu']['format']['items'])) {
            $options['menu']['format']['items'] .= ' tiny_fontcase_menu';
        }

        return $options;
    }
}
