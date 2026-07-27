/**
 * Tiny Pinyin primary initialization module.
 *
 * @module      tiny_pinyin/plugin
 * @copyright   2026 Developer
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getSetup} from './commands';

export default {
    init: async() => {
        const setupPlugin = await getSetup();
        const TinyMCE = await import('editor_tiny/loader');

        TinyMCE.PluginManager.add('pinyin', (editor) => {
            setupPlugin(editor);
        });
    }
};
