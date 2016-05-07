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

This will display images from a media directory on the same server as this application (otherwise may experience cross-domain problems).

This app works with the ScreenBase Upload and Admin components. Images uploaded to the media directory will be added to the slideshow in realtime (on the next cycle through, or tag group selection).

Supported by a mySQL database for persistant 'likes' and basic 'tags'.

The database allows separate slideshows from the same media directory, using a database 'appName' field to filter the images. 

The app has three slideshow modes, including one that allows images to be grouped by tag. Tag groups may then be selected onscreen by the user.

For screen networks, touched images and tag group buttons may be shared as an event. All screens will then mirror the current selection, allowing a more shared experience at different locations. This may require UNION Server and some of the Screens in the Wild framework core components.

As this version of the ScreenBase Slideshow is instantiated, for each application/slideshow you will need to make a copy of all project files and then customise the settings and styling.

Currently, this system is configured for four screens:
New Art Exchange, Nottingham (NA)
Broadway Cinema, Nottingham (BW)
Walthamstow, London (WA)
Edgware Road, London (LE)
You will need to edit these to match your own screens IDs.

TO DO

# Add a single config file that will work with PHP, HTML and JavaScript. See: credentials.js in screenbase_unity_slideshow for example of how to an implement this, passing the values on to PHP.


CONFIGURATION


Javascript/HTML:

Project Name For Display

index.html, <title>ScreenBase - <new project name> - Display Module</title>

Project Name For Filenames
config.js, var experienceName = "<new project name>";
Note: this is also used as the variable 'appName' which is used to filter returned images from the mySQL 'media' table. In the ScreenGram Admin module, experienceName is the same value as is listed here in the column 'Application/Experience'.

Relative path to media store

config.js, var relativePathToMediaStore = "<relative path to media files>"; For example: "../../../../images/"

URL to media store
config.js, var dataStoreURL = "<URL path to media files>"; For example: "http://<your site>/images/"

Choose slideshow display type

config.js

The two variables controlling this are:
var autoSlideShowGroupedByTag=false;
var manualSlideShowControlledByTagButtons=false;

Options are: 

1. Transition = ordinary transition style slideshow = set both above FALSE.

2. Tagbutton = slideshow with groups of tagged images displaying according to user selection of onscreen radio-buttons buttons (button 1 displays only images with tag 1, button 2 displays only images with tag 2 etc)  = set manualSlideShowControlledByTagButtons=true; and autoSlideShowGroupedByTag=false;

Note: On screen tag buttons will need to be configured in config.js. The tags here need to match the tags found in the 'media' table of the mySQL database, added to images using the ScreenBase Upload Module.

3. Tagsequence = slideshow with groups of tagged images displaying cyclically by tag group (all images with tag 1, then all with tag 2 etc) -  location specific and synchronously interactive (touching one tag will jump to displaying photos in that tag group, at all screens, assuming that UNION Server is present to share events)  = set manualSlideShowControlledByTagButtons=false; and autoSlideShowGroupedByTag=true;

config.js, if you want to use tags, you will need to specify the names for these, at the end of this file. These need to match those configured in the instance of the ScreenBase Upload module, used to add files to the database.

config.js, if you want to use UNION Server to share a selected image or tag button across a SitW screens network, then you will need to configure this:
var server = "<UNION server IP address>";
var port = <UNION SERVER PORT>; Example: I used port 8080.

PHP:

MySQL database credentials

setLikeCountForImage.php, $con = mysql_connect("<database_host_servername>","<database_host_username>","<database_host_password>");

setLikeCountForImage.php, mysql_select_db("<database name>", $con);

getLikeCountForImage.php, $con = mysql_connect("<database_host_servername>","<database_host_username>","<database_host_password>"); 

getLikeCountForImage.php, mysql_select_db("<database name>", $con);

getMediaFilename.php, $con = mysql_connect("<database_host_servername>","<database_host_username>","<database_host_password>");

getMediaFilename.php, mysql_select_db("<database name>", $con);