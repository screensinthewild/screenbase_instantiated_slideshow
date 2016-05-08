screenbase_instantiated_slideshow

Author:  Steve North
Author URI:  http://www.cs.nott.ac.uk/~pszsn/
License: AGPLv3 or later
License URI: http://www.gnu.org/licenses/agpl-3.0.en.html
Can: Commercial Use, Modify, Distribute, Place Warranty
Can't: Sublicence, Hold Liable
Must: Include Copyright, Include License, State Changes, Disclose Source
This research was originally funded in the UK under EPSRC grant reference EP/I031839/1 and title ‘Exploring the potential of networked urban screens for communities and culture’.

Copyright (c) 2015, The University of Nottingham

DESCRIPTION

A customisable, automatic image slideshow, primarily intended for use with a network of public-facing, urban screens (such as the 'Screens in the Wild' framework). Styled for a portrait, touch-based display, with available browser screen space of 745x1340. 

Consists of three modules: slideshow_display, slideshow_upload and slideshow_admin. 

Supports three different types of slideshow.

Supported by a mySQL database for persistent 'likes' and basic 'tags'.

The database allows separate slideshows from the same media directory, using a database 'appName' field to filter the images. 

As this version of the ScreenBase Slideshow is instantiated, for each application/slideshow you will need to make a copy of all project files and then customise the settings and styling.

More information in the sub-directory for each of the three modules.


TO DO

# Add a single config file that will work with PHP, HTML and JavaScript. See: credentials.js in screenbase_unity_slideshow for example of how to an implement this, passing the values on to PHP.
