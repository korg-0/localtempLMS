<?php
defined('MOODLE_INTERNAL') || die();

/**
 * Greetings Block Class.
 *
 * @package    block_greetings
 */
class block_greetings extends block_base {

    /**
     * Initialize the block title and metadata.
     */
    public function init() {
        $this->title = get_string('pluginname', 'block_greetings');
    }

    /**
     * Define the visible content layout framework inside the block container.
     */
    public function get_content() {
        global $DB, $USER, $OUTPUT;

        if ($this->content !== null) {
            return $this->content;
        }

        $this->content = new stdClass();
        $this->content->text = '';
        $this->content->footer = '';

        if (!isloggedin() || isguestuser()) {
            return $this->content;
        }

        // Pull saved greetings data from your new block database table
        $greeting = $DB->get_record('block_greetings', ['userid' => $USER->id], '*', IGNORE_MULTIPLE);

        $message = $greeting ? format_string($greeting->message) : get_string('defaultgreeting', 'block_greetings');

        // Render content cleanly
        $this->content->textHTML = html_writer::tag('div', $message, ['class' => 'block_greetings_message text-center font-weight-bold my-2']);
        $this->content->text = "Hello, " . fullname($USER) . "!<br>" . $this->content->textHTML;

        return $this->content;
    }

    /**
     * Allow adding this block multiple times on a single layout page.
     */
    public function instance_allow_multiple() {
        return false;
    }
}