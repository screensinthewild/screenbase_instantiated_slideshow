


/* Just to explain (remind myself in the future!)...
an autoSlideShowGroupedByTag is like the dfuse/brief encounter model...
a manualSlideShowControlledByTagButtons is like the ScreenGram Instagram/Twitter, tag buttons on screen model
If neither of these is enabled (don't enable both at once!), you get:
a regularTransitionSlideShow...which is one slide just replacing another
*/

var autoSlideShowGroupedByTag=false;
var manualSlideShowControlledByTagButtons=false;

var enableLikesForRegularAndTagButtonSlideShows = true;

var experienceName = "screenbase";

// IMPORTANT: the config properties for the mySQL media query are in experience.js init(). See notes there...

// The ID of the room users will join in order to draw together
var roomID = "sitw." + experienceName;

var dataStoreURL = "<your site>/<your media directory>";

// Relative path to media store is used by regularTransitionSlideShow and manualSlideShowControlledByTagButtons
// If running in screenbase\<appName>\display\stable
var relativePathToMediaStore = "../../../images/";
// If running in screenbase\<appName>\display\<versionOfDisplayWithSlideShow>\stable
// Need to go up one more level!
//var relativePathToMediaStore = "../../../../../images/";


// Steve: making it easier to switch server
var server = "<UNION Server IP address>";
var port = 8080;

var maximumImagesToShowForEachTag=4;

/* ################# TIMERS AND SPPED CONTROL ################ */


//var numberOfMillisecondsBetweenSlides = 2500;
//var numberOfMillisecondsBetweenSlides = 5500;
var numberOfMillisecondsBetweenSlides = 10000;

// 15 mins = 900 secs
var secondsUntilPageRefresh = 900;
//var secondsUntilPageRefresh = 60;

var timeToRunEachTagInMillisecs = 25000;
//var millisecsTouchedSlideFrozenFor = 6000;
var millisecsTouchedSlideFrozenFor = 16000;
//Specify the slider's slide speed (larger is faster 1-10)
//var slidespeed=6;
var slidespeed=3;

var millisecsToShowInfo = 10000;
//var timeUntilShowPhotoNotificationFades = 2500;
var timeUntilShowPhotoNotificationFades = 12500;
var timeUntilRemoteLikeNotificationFades = 2500;

/* ################# SCREEN POSITIONS ################ */

var jcontainerPositionFromTop= 0;

//var slideShowPositionFromTop = "400px";
var slideShowPositionFromTop = "496px";
var slideShowPositionFromLeft = "0px";

var top_row_image_PositionFromTop = 5;
//var top_row_image_PositionFromTop = 105;
var top_row_image_PositionFromLeft = 5;
//var top_row_image_PositionFromLeft = 260;

var like_buttonPositionFromTop = 150;

var like_buttonPositionFromLeft = 1;

var likeCounterPositionFromTop = 390;
var likeCounterPositionFromTopWhenNotDFUSEmode = 905;
var likeCounterPositionFromLeft = 110;

var like_heart_iconPositionFromTop = 305;
var like_heart_iconPositionFromTopWhenNotDFUSEmode = 820;
var like_heart_iconPositionFromLeft = 15;

//var info_popupPositionFromTop=jcontainerPositionFromTop;
var info_popupPositionFromTop=40;

var tagNameLabelPositionFromTop = 910;
//var tagNameLabelPositionFromTop = 25;
// as %
var tagNameLabelPositionFromLeft = 5;

var textForInfoWindowPositionFromTop = 30
var textForInfoWindowPositionFromLeft = 10;

var _indicatorPositionFromTop = 800;
var _indicatorPositionFromLeft = 0;

var infoButtonPositionFromTop = 885;
//var infoButtonPositionFromLeft = 527;
var infoButtonPositionFromLeft = 522;


/* ################# ENABLE / DISABLE ################ */

var touchImageCyclesNextSlide = true;

var useSingleNotificationNotList = true;

var use_indicators = false;
var showLike_Button = false;
var showlike_heart_icon = false;
var showLikeCounter = false;
var show_top_row_image = true;
var showMessage = true;

// enable guide to show where iSpy vid link panel will be
var showISpy_reserved_space = false;

var tagNameLabelFontSize = 40;
var textForInfoWindowFontSize = 30;

/* ################# TEXT AND LABELS ################ */

//var ifTouchedLocationIntroText = "You touched a photo from: ";
var ifTouchedLocationIntroText = "You are showing people at all other screens a photo from: ";
var photoShowingStartTxt = "Someone at ";
var photoShowingEndTxt = " showed you this photo from: ";

var LikeNotifyStartTxt = "Someone from ";
var LikeNotifyEndTxt = " just 'Liked' the photo you touched!";

var NewArtExchangeLocationDescription = "New Art Exchange, Nottingham";
var BroadwayLocationDescription = "Broadway Cinema, Nottingham";
var WalthamstowLocationDescription = "Walthamstow, London";
var LeytonstoneLocationDescription = "Leytonstone, London";

var textForInfoWindow = "<h1>Info</h1>This is an instance of the ScreenBase framework<BR>Edit this...";

/* ################# SIZES ################ */

var experienceHeight = 1340;
//var experienceWidth = 750;

//var experienceHeight = 1330;
var experienceWidth = 745;

var top_row_image_Width = experienceWidth;

// Convert to 3:2 - standard portrait aspect for DSLR camera
// So... height is 2/3 of height
var top_row_image_Height = top_row_image_Width * 0.66;

//Specify the slider's width (in pixels)
//var sliderwidth="750px"
var sliderwidth=experienceWidth.toString()+"px"; 
//var sliderwidth="700px"; 

var slideHeight = "392px";

//Specify the slider's height
var sliderheight=slideHeight;


// Would be better if next line was auto from sliderHeight
var eachSlideHeight=slideHeight;

// Convert to 3:2 - standard portrait aspect for DSLR camera
// So... width is 1.5 * height
var eachSlideWidth="588px";


var info_popupHeight = 600;
var info_popupWidth = 650;


var likeCounterFontSize = 60;
var likeCounterValue = "0";

//configure background color:
//slidebgcolor="#EAEAEA";
var slidebgcolor="#000000";

//Specify gap between each image (as whitespace characters):
var imagegap=" "

//Specify pixels gap between each slideshow rotation (use integer):
var slideshowgap=5

// infoButton
var showInfoButton = true;

var tags = new Array();
var categoryLabels = new Array();

tags[0] = "TestTag1";
categoryLabels[0] = "TestTagLabel1";

tags[1] = "TestTag2";
categoryLabels[1] = "TestTagLabel2";

tags[2] = "TestTag3";
categoryLabels[2] = "TestTagLabel3";





