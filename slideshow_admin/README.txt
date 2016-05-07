slideshow_admin

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

Image upload module for ScreenBase...

CONFIGURATION

Javascript/HTML:

Project Name For Display
index.html, <title>ScreenBase - <new project name> - admin page</title>
index.html, <H1>ScreenBase - <new project name> - Admin</H1>
config.js, var uploaderNameToDisplay = "<h1>ScreenBase - <new project name> - Uploader</h1>"; 

PHP:

Project Name For Filenames
Note: this is what will filter files that are available to admin. Filtered by an entry in the 'media' database table. So, if images are added to the database, using the Upload Module, the App Name value assigned to them can be used to decide whether they are available to Admin, or not.

getMediaData.php, $appName = "<new project name>";

getMediaData.php, $con = mysql_connect("<database_host_servername>","<database_host_username>","<database_host_password>");

getMediaData.php, mysql_select_db("<database name>", $con);

URL to media store
getMediaData.php, $URLforMediaServer = "<URL path to media files>"; For example: "http://<your site>/images/"


deleteMedia.php, $con = mysql_connect("<database_host_servername>","<database_host_username>","<database_host_password>"); 

deleteMedia.php, mysql_select_db("<database name>", $con);

Relative path to media store
deleteMedia.php, $filePathToMediaStore = "<relative path to media files>"; For example: "../../../../images/"

