<?php
defined('MOODLE_INTERNAL') || die();

/**
 * Unit tests for the Text Substitute filter class.
 *
 * @package    filter_textsubstitute
 * @category   test
 * @coversDefaultClass \filter_textsubstitute\text_filter
 */
class filter_textsubstitute_text_filter_test extends \advanced_testcase {

    /**
     * Check that search terms are substituted with another given term when filtered.
     *
     * @param string $searchterm Word to find.
     * @param string $substituteterm Word to replace it with.
     * @param string $formats Comma-separated list of allowed formats.
     * @param int $originalformat Format of the input text.
     * @param string $inputtext Raw text.
     * @param string $expectedtext Expected filtered output text.
     *
     * @dataProvider filter_textsubstitute_provider
     * @covers ::filter
     */
    public function test_filter_textsubstitute($searchterm, $substituteterm, $formats, $originalformat, $inputtext, $expectedtext): void {
        $this->resetAfterTest(true);
        $this->setAdminUser();

        // Set the plugin configuration keys using the exact names from our filter class.
        set_config('searchterm', $searchterm, 'filter_textsubstitute');
        // Note: Mapping 'substituteterm' to our 'replacewith' key, and 'formats' to 'applytoformats'
        set_config('replacewith', $substituteterm, 'filter_textsubstitute');
        set_config('applytoformats', $formats, 'filter_textsubstitute');

        // Instantiate our custom filter.
        $filterplugin = new \filter_textsubstitute\text_filter(\context_system::instance(), []);
        // Filter the text context string.
        $filteredtext = $filterplugin->filter($inputtext, ['originalformat' => $originalformat]);

        // Assert that actual string equals expected output string.
        $this->assertEquals($expectedtext, $filteredtext);
    }

    /**
     * Data provider for {@see test_filter_textsubstitute}
     *
     * @return array
     */
    public function filter_textsubstitute_provider(): array {
        return [
            'All formats allowed - html' => [
                'searchterm' => 'Moodle',
                'substituteterm' => 'Workplace',
                'formats' => FORMAT_HTML . ',' . FORMAT_MARKDOWN . ',' . FORMAT_MOODLE . ',' . FORMAT_PLAIN,
                'originalformat' => FORMAT_HTML,
                'inputtext' => 'Moodle is a popular LMS. You can download Moodle for free. MOODLE 4.2 is out now.',
                'expectedtext' => 'Workplace is a popular LMS. You can download Workplace for free. MOODLE 4.2 is out now.',
            ],
            'FORMAT_HTML is allowed' => [
                'searchterm' => 'Moodle',
                'substituteterm' => 'Workplace',
                'formats' => FORMAT_HTML,
                'originalformat' => FORMAT_HTML,
                'inputtext' => '<em>Moodle</em> is a popular LMS. You can download Moodle for free. MOODLE 4.2 is here.',
                'expectedtext' => '<em>Workplace</em> is a popular LMS. You can download Workplace for free. MOODLE 4.2 is here.',
            ],
            // 🚀 Extra Test Case 3: Verify that it does NOT filter when format doesn't match!
            'Format mismatch - should ignore' => [
                'searchterm' => 'Moodle',
                'substituteterm' => 'Workplace',
                'formats' => FORMAT_HTML,
                'originalformat' => FORMAT_PLAIN, // Input is plain text, but only HTML is allowed
                'inputtext' => 'Moodle is here.',
                'expectedtext' => 'Moodle is here.', // Remains untouched!
            ],
        ];
    }
}
