<?php
namespace tiny_pinyin;

defined('MOODLE_INTERNAL') || die();

class plugin extends \editor_tiny\plugin_backend implements \editor_tiny\plugin {

    public static function get_plugin_name(): string {
        return 'pinyin';
    }

    public static function update_configuration(array $options): array {
        if (isset($options['toolbar'])) {
            // Injects your new pinyin character popup button right after insert elements
            $options['toolbar'] .= ' tiny_pinyin_button';
        }
        return $options;
    }
}
