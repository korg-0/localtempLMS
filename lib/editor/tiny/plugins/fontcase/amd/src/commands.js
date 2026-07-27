/**
 * Button and menu registration and text commands handler for tiny_fontcase.
 *
 * @module      tiny_fontcase/commands
 * @copyright   2026 Developer
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from 'editor_tiny/utils';
import {get_string as getString} from 'core/str';
import {
    component,
    uppercaseButtonName,
    lowercaseButtonName,
} from './common';

/**
 * Text case changer execution function.
 *
 * @param {Object} editor The TinyMCE instance.
 * @param {String} toCase The requested case format ('uppercase' or 'lowercase').
 */
const changeCase = (editor, toCase) => {
    const selectedText = editor.selection.getContent({format: 'text'});
    if (selectedText.length > 0) {
        const newText = toCase === 'uppercase'
            ? selectedText.toUpperCase()
            : selectedText.toLowerCase();
        editor.insertContent(newText);
    }
};

/**
 * Get the setup function for the toolbar buttons and Format menu items.
 *
 * @returns {function} The registration function to call within the Plugin.add function.
 */
export const getSetup = async() => {
    // Fetch language strings and icons (including the main plugin icon for the menu)
    const [
        lowercaseTitle,
        lowercaseImage,
        uppercaseTitle,
        uppercaseImage,
        pluginMenuTitle,
        pluginMenuImage,
    ] = await Promise.all([
        getString('lowercase', component),
        getButtonImage('lowercase', component),
        getString('uppercase', component),
        getButtonImage('uppercase', component),
        getString('pluginname', component),
        getButtonImage('icon', component), // Uses icon.svg for the parent menu item
    ]);

    return (editor) => {
        // 1. Register icons for use as TinyMCE components
        editor.ui.registry.addIcon('lowercaseIcon', lowercaseImage.html);
        editor.ui.registry.addIcon('uppercaseIcon', uppercaseImage.html);
        editor.ui.registry.addIcon('pluginMenuIcon', pluginMenuImage.html);

        // 2. Register Toolbar Buttons
        editor.ui.registry.addButton(lowercaseButtonName, {
            icon: 'lowercaseIcon',
            tooltip: lowercaseTitle,
            onAction: () => changeCase(editor, 'lowercase'),
        });

        editor.ui.registry.addButton(uppercaseButtonName, {
            icon: 'uppercaseIcon',
            tooltip: uppercaseTitle,
            onAction: () => changeCase(editor, 'uppercase'),
        });

        // 3. Register Submenu Items (Children)
        editor.ui.registry.addMenuItem('tiny_fontcase_menu_lower', {
            text: lowercaseTitle,
            icon: 'lowercaseIcon',
            onAction: () => changeCase(editor, 'lowercase'),
        });

        editor.ui.registry.addMenuItem('tiny_fontcase_menu_upper', {
            text: uppercaseTitle,
            icon: 'uppercaseIcon',
            onAction: () => changeCase(editor, 'uppercase'),
        });

        // 4. Register the Parent Nested Menu Item with the Main Plugin Icon
        editor.ui.registry.addNestedMenuItem('tiny_fontcase_menu', {
            text: pluginMenuTitle,
            icon: 'pluginMenuIcon',
            getSubmenuItems: () => [
                'tiny_fontcase_menu_lower',
                'tiny_fontcase_menu_upper'
            ],
        });
    };
};
