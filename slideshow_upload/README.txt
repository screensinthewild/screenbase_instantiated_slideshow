slideshow_upload

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

The Upload module for ScreenBase...

CONFIGURATION

Javascript/HTML:

config.js, var uploaderNameToDisplay = "<h1>ScreenBase - <new project name> - Uploader</h1>"; 

config.js, var filePathToMediaStore = "../../../images/";

AppNames are used to filter which images are available in the Display and Admin modules.

The following determine whether an uploaded image has a fixed AppName or the user can choose an AppName from a drop-down menu:

var useAppName = true; //if false, then fixedAppName variable will apply
var fixedAppName = "screenbase";
appNames[] // array containing AppNames for drop-down menu.


Screen locations and tags may also be configured at the bottom of config.js.

PHP:

index.php
mySQL database credentials-
$servername = "<database host>";
$username = "<database username>";
$password = "<database password>";
