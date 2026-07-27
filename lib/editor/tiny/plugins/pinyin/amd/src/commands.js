/**
 * Dialog UI registration and commands handler for tiny_pinyin.
 *
 * @module      tiny_pinyin/commands
 * @copyright   2026 Developer
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from 'editor_tiny/utils';
import {get_string as getString} from 'core/str';
import {component, buttonName} from './common';

// The list of Pinyin characters to display in the grid selection panel
const pinyinChars = [
    'ā', 'á', 'ǎ', 'à', 'ō', 'ó', 'ǒ', 'ò',
    'ē', 'é', 'ě', 'è', 'ī', 'í', 'ǐ', 'ì',
    'ū', 'ú', 'ǔ', 'ù', 'ǖ', 'ǘ', 'ǚ', 'ǜ'
];

/**
 * Open the selection dialog window modal.
 *
 * @param {Object} editor The TinyMCE instance.
 * @param {String} title The dialog title string.
 */
const openDialog = (editor, title) => {
    editor.windowManager.open({
        title: title,
        body: {
            type: 'panel',
            items: [
                {
                    type: 'collection',
                    name: 'pinyin_collection',
                    columns: 8
                }
            ]
        },
        buttons: [
            {
                type: 'cancel',
                text: 'Close',
                name: 'close'
            }
        ],
        initialData: {
            pinyin_collection: pinyinChars.map(char => ({
                value: char,
                text: char,
                icon: char // Displays the character itself inside the box grid
            }))
        },
        onAction: (dialogApi, details) => {
            if (details.name === 'pinyin_collection') {
                // Inject the chosen character at the current cursor selection point
                editor.insertContent(details.value);
                dialogApi.close();
            }
        }
    });
};

/**
 * Fetch assets asynchronously and prepare the plugin setup configuration.
 *
 * @returns {function} The initialization function wrapper.
 */
export const getSetup = async() => {
    const [
        pluginTitle,
        pluginImage,
    ] = await Promise.all([
        getString('pluginname', component),
        getButtonImage('icon', component), // Searches for pix/icon.svg
    ]);

    return (editor) => {
        // Register your button icon
        editor.ui.registry.addIcon('pinyinIcon', pluginImage.html);

        // Register the main toolbar button
        editor.ui.registry.addButton(buttonName, {
            icon: 'pinyinIcon',
            tooltip: pluginTitle,
            onAction: () => openDialog(editor, pluginTitle)
        });
    };
};
