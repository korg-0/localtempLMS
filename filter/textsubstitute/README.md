# Text substitute #

ext Substitute Filter
A lightweight, configuration-driven text processing plugin for Moodle 4.0+ that allows site administrators to automatically search for and replace specific string patterns across course text content before it is rendered on screen.

Detailed Description
The Text Substitute Filter intercepts Moodle's output rendering pipeline to dynamically update terms, phrases, or branding nomenclature across the platform without altering the underlying database records.

This is incredibly useful for:

Dynamic Rebranding: Instantly changing platform names, university titles, or system references (e.g., substituting "Moodle" with "Uni-Learn").

Terminology Standardization: Correcting recurring text habits across multiple courses simultaneously (e.g., swapping "courses" out for "modules").

Format-Selective Parsing: Fine-tuning execution variables via built-in configuration rules so string transformations only fire on specified output contexts like HTML strings, while safely bypassing plain text, markdown, or system configurations.

## Installing via uploaded ZIP file ##

1. Log in to your Moodle site as an admin and go to _Site administration >
   Plugins > Install plugins_.
2. Upload the ZIP file with the plugin code. You should only be prompted to add
   extra details if your plugin type is not automatically detected.
3. Check the plugin validation report and finish the installation.

## Installing manually ##

The plugin can be also installed by putting the contents of this directory to

    {your/moodle/dirroot}/filter/textsubstitute

Afterwards, log in to your Moodle site as an admin and go to _Site administration >
Notifications_ to complete the installation.

Alternatively, you can run

    $ php admin/cli/upgrade.php

to complete the installation from the command line.

## License ##

2026 Korg <you@example.com>

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program.  If not, see <https://www.gnu.org/licenses/>.
