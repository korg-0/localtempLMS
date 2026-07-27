YUI.add('moodle-atto_pinyin-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_pinyin
 * @copyright  2019 Rajneel Totaram
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Atto text editor character map plugin
 *
 * @module moodle-atto_pinyin-button
 */

var COMPONENTNAME = 'atto_pinyin',
    CSS = {
        BUTTON: 'atto_pinyin_character',
        CHARMAP: 'atto_pinyin_selector'
    },
    /*
     * Map of special characters, kindly borrowed from TinyMCE.
     *
     * Each entries contains in order:
     * - {String} HTML code
     * - {String} HTML numerical code
     * - {Boolean} Whether or not to include it in the list
     *
     * @property CHARMAP
     * @type {Array}
     */
    CHARMAP = [
        ['&#257;', '&#257;', true],
        ['&#225;', '&#225;', true],
        ['&#462;', '&#462;', true],
        ['&#224;', '&#224;', true],
		['&#275;', '&#275;', true],
		['&#233;', '&#233;', true],
		['&#283;', '&#283;', true],
		['&#232;', '&#232;', true],
		['&#299;', '&#299;', true],
		['&#237;', '&#237;', true],
		['&#464;', '&#464;', true],
		['&#236;', '&#236;', true],
		['&#333;', '&#333;', true],
		['&#243;', '&#243;', true],
		['&#466;', '&#466;', true],
		['&#242;', '&#242;', true],
		['&#363;', '&#363;', true],
		['&#250;', '&#250;', true],
		['&#468;', '&#468;', true],
		['&#249;', '&#249;', true],
		['&#470;', '&#470;', true],
		['&#472;', '&#472;', true],
		['&#474;', '&#474;', true],
		['&#476;', '&#476;', true],
		['&#252;', '&#252;', true]
    ];


/**
 * Atto text editor charmap plugin.
 *
 * @namespace M.atto_pinyin
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

Y.namespace('M.atto_pinyin').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    /**
     * A reference to the current selection at the time that the dialogue
     * was opened.
     *
     * @property _currentSelection
     * @type Range
     * @private
     */
    _currentSelection: null,

    initializer: function() {
        this.addButton({
            icon: 'icon',
            iconComponent: 'atto_pinyin',
            callback: this._displayDialogue
        });
    },

    /**
     * Display the Character Map selector.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {
        // Store the current selection.
        this._currentSelection = this.get('host').getSelection();
        if (this._currentSelection === false) {
            return;
        }

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('insertcharacter', COMPONENTNAME),
            focusAfterHide: true
        }, true);

        // Set the dialogue content, and then show the dialogue.
        dialogue.set('bodyContent', this._getDialogueContent())
                .show();
    },

    /**
     * Return the dialogue content for the tool.
     *
     * @method _getDialogueContent
     * @private
     * @return {Node} The content to place in the dialogue.
     */
    _getDialogueContent: function() {
        var template = Y.Handlebars.compile(
            '<div class="{{CSS.CHARMAP}}">' +
                '{{#each CHARMAP}}' +
                    '{{#if this.[2]}}' +
                    '<button class="{{../../CSS.BUTTON}}" ' +
                        'aria-label="{{get_string pinyin ../../component}}" ' +
                        'data-character="{{this.[0]}}" ' +
                    '>{{{this.[0]}}}</button>' +
                    '{{/if}}' +
                '{{/each}}' +
            '</div>'
        );

        var content = Y.Node.create(template({
            component: COMPONENTNAME,
            CSS: CSS,
            CHARMAP: CHARMAP
        }));

        content.delegate('click', this._insertChar, '.' + CSS.BUTTON, this);
        return content;
    },

    /**
     * Insert the picked character into the editor.
     *
     * @method _insertChar
     * @param {EventFacade} e
     * @private
     */
    _insertChar: function(e) {
        var character = e.target.getData('character');

        // Hide the dialogue.
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        var host = this.get('host');

        // Focus on the last point.
        host.setSelection(this._currentSelection);

        // And add the character.
        host.insertContentAtFocusPoint(character);

        // And mark the text area as updated.
        this.markUpdated();
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
