/**
 * Tiny Font Case primary plugin module.
 *
 * @module      tiny_fontcase/plugin
 * @copyright   2026 Developer
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getSetup} from './commands';

export default {
    init: async() => {
        const setupButtons = await getSetup();

        // Load the TinyMCE loader module safely using standard imports
        const TinyMCE = await import('editor_tiny/loader');

        TinyMCE.PluginManager.add('fontcase', (editor) => {
            // Run the buttons registration wrapper
            setupButtons(editor);
        });
    }
};
