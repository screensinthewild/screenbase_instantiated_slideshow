
var regularTransitionSlideTimer;

var currentMediaFileNameForLikes;

var arrayOfImageURLs;

var curimg=0;

// The Orbiter object, which is the root of Union's JavaScript client framework
var orbiter;

// The MessageManager object, for sending and receiving messages
var msgManager;

// A convenience reference to net.user1.orbiter.UPC, which provides a
// list of valid client/server UPC messages. See: http://unionplatform.com/specs/upc/
var UPC = net.user1.orbiter.UPC;

// A hash of experience room message names used in this application. MOVE means move 'something' (avatar..pen...object etc)
// to the specified position. Add other custom messages here.... i.e. {MOVE:"MOVE", JUMP:"JUMP"};

var Messages = { SLIDESHOWSNAPSHOT: "SLIDESHOWSNAPSHOT", LIKE: "LIKE", POSITION: "POSITION" };

var currentOneStringContainingAllSlideShowHTMLImageTagsWithGapsAndNoBreak;
var currentTopRowImageURL;
var currentTagCategory;

var slideShowFrozen=false;

var keepInfoVisibleTimer;
var keepFrozenTimer;

var hasTouch = false;

var finalslide=''

var copyspeed=slidespeed

var iedom=document.all||document.getElementById

var arrayOfSlideShowHTMLImageTags=new Array();

var actualwidth=''
var cross_slide, ns_slide

var slideFrameRateCounterRunning = false;

var URLarraySize = tags.length;

var counter = 0;

var screenLocation;
var locationOfRempoteScreenSendingUsMessage;



function init () {


screenLocation = translateTwoDigitLocationCodeIntoTextString ( (getURLparameterValue("loc")) );

doHTMLstuff();

initLayoutCustomComponents();

selectSlideShowType ();

registerInputListeners();

initUnion();

}

function 
selectSlideShowType () 
{

if(autoSlideShowGroupedByTag==true)
{
doAutoSlideShowGroupedByTag();
}

else if(manualSlideShowControlledByTagButtons==true)
{
doManualSlideShowControlledByTagButtons(); 
}

else
// is regular a transitionSlideShow
{
doRegularTransitionSlideShow("");
}

}









/* ##############  START RegularTransitionSlideShow  ######### */


function doRegularTransitionSlideShow (tag) 
{

/*******************  START CONFIG STUFF **********************************/

// This is only here because I was having problems with global variables not being 
// accessible for the getImageURLs() function.
// init() is called from HTML and (although config.js has been pre-loaded) 
// variables in config.js are not found!! Nor are globals declared at the head
// of this file. Hmmm....

// Media search properties for mySQL

//var appName = "screenbase";
var appName = experienceName;

// The following params are not yet supported in the PHP...TO BE DONE...
var location = "";
var likeCount;
var startDateCreatedPeriod;
var endDateCreatedPeriod;
var personName;
var mediaType = "image";

/*******************  END CONFIG STUFF **********************************/


document.getElementById("like_heart_icon").style.top = like_heart_iconPositionFromTopWhenNotDFUSEmode+"px";
document.getElementById("like_counter").style.top = likeCounterPositionFromTopWhenNotDFUSEmode+"px";

getImageURLs(appName, tag, location, likeCount, startDateCreatedPeriod, endDateCreatedPeriod, personName, mediaType);

/********* Start: Steve fix for start on first slide ***/
//regularTransitionSlideTimer = setInterval("getNextSlideInRegularTransitionSlideShow()", numberOfMillisecondsBetweenSlides);
/********* End: Steve fix for start on first slide ***/

}


function getImageURLs(appName, tag, location, likeCount, startDateCreatedPeriod, endDateCreatedPeriod, personName, mediaType)
{


xmlhttp=new XMLHttpRequest();
xmlhttp.onreadystatechange=function()
{

if (xmlhttp.readyState==4 && xmlhttp.status==200)
{

var response = xmlhttp.responseText;

// This checks if return is just a bunch of string space
// When something is not found by MySQL, 
// xmlhttp.responseText seems to just be a string of length = 3.
// So, this triggers if image should have zero likes...
if(response.replace(/\s/g,"") == "")
{
response = "empty";
}


// replace any white spaces left in filenames with nothing
response = response.split(' ').join('');

// separate filenames into an array, by commas
arrayOfImageURLs = response.split(',');

/********* Start: Steve fix for start on first slide ***/
getNextSlideInRegularTransitionSlideShow();
regularTransitionSlideTimer = setInterval("getNextSlideInRegularTransitionSlideShow()", numberOfMillisecondsBetweenSlides);
/********* End: Steve fix for start on first slide ***/

//console.log("My images: "+response);

}
}


xmlhttp.open("GET", "getMediaFilename.php?appName="+appName+"&tag="+tag+"&location="+location+"&likeCount="+likeCount+"&startDateCreatedPeriod="+startDateCreatedPeriod+"&endDateCreatedPeriod="+endDateCreatedPeriod+"&personName="+personName+"&mediaType="+mediaType,true);

//console.log(tag);

xmlhttp.send();

}


function getNextSlideInRegularTransitionSlideShow() {

document.getElementById("slideshow_image").setAttribute("src", "");
document.getElementById("like_heart_icon").style.visibility = 'hidden';
document.getElementById("like_counter").style.visibility = 'hidden';

currentMediaFileNameForLikes = arrayOfImageURLs[curimg];

//console.log(curimg);
if(arrayOfImageURLs[curimg])
{
if(enableLikesForRegularAndTagButtonSlideShows)
getLikeCountFromImageURL(currentMediaFileNameForLikes);
}

/* ################ START EMERGENCY PROCEDURE IF AN UNDEFINED IMAGE SNEAKS THROUGH ######## */

if(typeof(arrayOfImageURLs[curimg]) == "undefined")
{
console.log("imagename is UNDEFINED...resetting SlideShow");

// Stop the slide timer!
clearInterval(regularTransitionSlideTimer);

// Reset the slideshow increment counter!
curimg=0;


if (manualSlideShowControlledByTagButtons)
{
// Turn all of the tag button transparent

for(i=0; i<tags.length; i++)	
{
document.getElementById(tags[i]).style.background = "transparent";
}
doManualSlideShowControlledByTagButtons(); 
}

else

{
doRegularTransitionSlideShow("");
}

/* ################ END EMERGENCY PROCEDURE IF AN UNDEFINED IMAGE SNEAKS THROUGH ######## */


}
//console.log(arrayOfImageURLs[curimg]);

document.getElementById("slideshow_image").setAttribute("src", relativePathToMediaStore+arrayOfImageURLs[curimg]);
//document.getElementById("slideshow_image").setAttribute("src", "../../../../images/"+arrayOfImageURLs[curimg]);

if(enableLikesForRegularAndTagButtonSlideShows)
{
document.getElementById("like_heart_icon").style.visibility = 'visible';
document.getElementById("like_counter").style.visibility = 'visible';
}

curimg++;

if(!manualSlideShowControlledByTagButtons)
{

// if we're out of images in array...reload everything to pick up any changes in the media store
if(curimg==arrayOfImageURLs.length+1)
{
document.getElementById("like_heart_icon").style.visibility = 'hidden';
document.getElementById("like_counter").style.visibility = 'hidden';
window.location.reload(true);
}

}

if(manualSlideShowControlledByTagButtons && curimg==arrayOfImageURLs.length)
{
curimg=0;
}


} 

/* ##############  START RegularTransitionSlideShow  ######### */












/* ##############  START AutoSlideShowGroupedByTag - the DFUSE model   ######### */

function doAutoSlideShowGroupedByTag () 
{
// This is the DFUSE - "Brief Encounter" model...

// Call it immediately to get started...
autoSlideShowGroupedByTag_changeToNextTag();
// Start a timer to call it after interval...
var myVar=setInterval(function(){autoSlideShowGroupedByTag_changeToNextTag()},timeToRunEachTagInMillisecs);

}


function autoSlideShowGroupedByTag_changeToNextTag() {

// don't change to next tag, if someone has clicked/touched 
// a photo, as this will look messy!
if(slideShowFrozen==false)
{

if (counter>URLarraySize-1)
{ counter = 0;}

//console.log("Counter = "+counter);

currentTag = tags[counter];
currentTagCategory = categoryLabels[counter];

autoSlideShowGroupedByTag_doSlideShowForCurrentTag();

counter++;

} // close only if not frozen loop

}


function autoSlideShowGroupedByTag_doSlideShowForCurrentTag() {


/*******************  START CONFIG STUFF **********************************/

// This is only here because I was having problems with global variables not being 
// accessible for the getImageURLs() function.
// init() is called from HTML and (although config.js has been pre-loaded) 
// variables in config.js are not found!! Nor are globals declared at the head
// of this file. Hmmm....

// Media search properties for mySQL
//var appName = "screenbase";
var appName = experienceName;

var tag ="";
// The following params are not yet supported in the PHP...TO BE DONE...
var location = "";
var likeCount;
var startDateCreatedPeriod;
var endDateCreatedPeriod;
var personName;
var mediaType = "image";

/*******************  END CONFIG STUFF **********************************/

getImageURLsForAutoSlideShowGroupedByTag(appName, currentTag, location, likeCount, startDateCreatedPeriod, endDateCreatedPeriod, personName, mediaType);

//console.log("Showing images for tag = "+tagScreenTitles[counter]);
//console.log("URL = "+tagURLs[counter]);

document.getElementById("message").innerHTML = currentTagCategory;


}

function getImageURLsForAutoSlideShowGroupedByTag(appName, tag, location, likeCount, startDateCreatedPeriod, endDateCreatedPeriod, personName, mediaType)
{

xmlhttp=new XMLHttpRequest();
xmlhttp.onreadystatechange=function()
{

if (xmlhttp.readyState==4 && xmlhttp.status==200)
{

var response = xmlhttp.responseText;

// This checks if return is just a bunch of string space
// When something is not found by MySQL, 
// xmlhttp.responseText seems to just be a string of length = 3.
// So, this triggers if image should have zero likes...
if(response.replace(/\s/g,"") == "")
{
response = "empty";
}


//console.log("Response = "+response);

// replace any white spaces left in filenames with nothing
response = response.split(' ').join('');

// separate filenames into an array, by commas
//arrayOfImageURLs = response.split(',');

arrayOfSlideShowHTMLImageTags = response.split(',');


 // Shuffle the contents of the array, so we can pick the first n to display and 
// get different images each time.
shuffleArray(arrayOfSlideShowHTMLImageTags);
  
 
 // if number of images required to show for this tag is greater than
// the actual number of images available for this tag
// set the number to show = actual number there are

// Use this temp to make sure that an empty tag category doesn't set maximumImagesToShowForEachTag 
// to zero for subsequent tags...symptoms = all images top and bottom row are the same!
var tempMaximumImagesToShowForEachTag = maximumImagesToShowForEachTag;

if(tempMaximumImagesToShowForEachTag > arrayOfSlideShowHTMLImageTags.length)
{
tempMaximumImagesToShowForEachTag = arrayOfSlideShowHTMLImageTags.length;
}

// Don't set it to zero!
if(tempMaximumImagesToShowForEachTag ==0)
{
tempMaximumImagesToShowForEachTag ==1;
}

 // cut down the array to the first n elements to display for each tag
arrayOfSlideShowHTMLImageTags=arrayOfSlideShowHTMLImageTags.splice(0, tempMaximumImagesToShowForEachTag);
  
 
for (var i = 0; i < arrayOfSlideShowHTMLImageTags.length; i++) 
{


// Strip out all carriage returns...there seemed to be a few...???
arrayOfSlideShowHTMLImageTags[i] = arrayOfSlideShowHTMLImageTags[i].replace(/\r?\n|\r/g, '');

arrayOfSlideShowHTMLImageTags[i] = "<img id=\""+ dataStoreURL + arrayOfSlideShowHTMLImageTags[i]+"\" src=\""+ dataStoreURL + arrayOfSlideShowHTMLImageTags[i]+"\" border=1 height="+eachSlideHeight+" width="+eachSlideWidth+">";
//console.log(arrayOfSlideShowHTMLImageTags[i]);
}


// Get URL of image to show on top row...
// But array containts HTML img tags, NOT image URLs, so extract URL 
currentTopRowImageURL = getURLfromHTMLimageTag(arrayOfSlideShowHTMLImageTags[0]);
changeTopRowImage(currentTopRowImageURL);

// If more than one image in the array, remove the first one...
// because in the last bit we've used it for the
// image on the top row and we don't want it 
// also showing on the bottom row!
if(arrayOfSlideShowHTMLImageTags.length > 1)
{
arrayOfSlideShowHTMLImageTags.shift();
}

//console.log("Image is: "+leftrightslide[0]);


// Copy all image tags in array, as one string,
// into a 'no break' HTML tag, separated by the spacing imagegap
currentOneStringContainingAllSlideShowHTMLImageTagsWithGapsAndNoBreak = '<nobr>'+arrayOfSlideShowHTMLImageTags.join(imagegap)+'</nobr>'

//console.log(currentOneStringContainingAllSlideShowHTMLImageTagsWithGapsAndNoBreak);

changeLowerRowSlideShow(currentOneStringContainingAllSlideShowHTMLImageTagsWithGapsAndNoBreak);

}
}

xmlhttp.open("GET", "getMediaFilename.php?appName="+appName+"&tag="+tag+"&location="+location+"&likeCount="+likeCount+"&startDateCreatedPeriod="+startDateCreatedPeriod+"&endDateCreatedPeriod="+endDateCreatedPeriod+"&personName="+personName+"&mediaType="+mediaType,true);


xmlhttp.send();

}

/* ##############  END AutoSlideShowGroupedByTag - the DFUSE model   ######### */










/* ##############  START ManualSlideShowControlledByTagButtons - the ScreenGram model   ######### */

function doManualSlideShowControlledByTagButtons() 
{
// This is based on the ScreenGram Instagram/Twitter, tag buttons on screen model...
//doRegularTransitionSlideShow("");
doRegularTransitionSlideShow(tags[0]);
document.getElementById(tags[0]).style.background = "red";

}

/* ##############  END ManualSlideShowControlledByTagButtons - the ScreenGram model   ######### */








// Register callback functions to handle user input
function 
registerInputListeners () {
 

document.onmousedown = pointerDownListener;

document.onmouseup = pointerUpListener;
 
document.ontouchstart = touchDownListener;

document.ontouchend = touchUpListener;


}














function doHTMLstuff() {

if (manualSlideShowControlledByTagButtons)
{
document.write('<div id = "button_panel" style="text-align:center; padding:5px;">');
document.write('<br/>');	
	
for(i=0; i<tags.length; i++)	
{
	document.write('<input id = "'+tags[i]+'" class="button" type="button" style="width:170px;height:80px" onclick="toggle(this.id);" value="'+'#'+tags[i]+'" />&nbsp;<BR><BR>');
}
	
document.write('<br/>');
document.write('</div>');
}

document.write('<div id="jcontainer">');

// Add the 'no break' HTML tag containing all images and gaps, into a SPAN HTML tag, set invisible
document.write('<span id="temp" style="visibility:hidden;position:absolute;top:-100px;left:-9000px"></span>')


document.write('<div id="message"></div>');

document.write('<table border="0" cellspacing="0" cellpadding="0"><td>')


if(autoSlideShowGroupedByTag)
{
// Note: overflow:hidden in next div is what masks off slideshow overflow
document.write('<div style="position:relative;left:'+slideShowPositionFromLeft+';top:'+slideShowPositionFromTop+';width:'+sliderwidth+';height:'+sliderheight+';overflow:hidden">');
document.write('<div style="position:absolute;width:'+sliderwidth+';height:'+sliderheight+';background-color:'+slidebgcolor+'">');
document.write('<div id="test2" style="position:absolute;left:0px;top:0px"></div>');
document.write('<div id="test3" style="position:absolute;left:-1000px;top:0px"></div>');
document.write('</div></div>');
document.write('</td></table>');
}


else
{
document.write('<div id="slideshow"/>');
document.write('<img id="slideshow_image"/>');
//document.write('<img id="slideshow_image" src="../../../../images/loading.jpg"/>');
document.write('</div>');
}


document.write('<img id="info" src="info.png"/>');

document.write('<div id="top_row_image"/></div>');

document.write('<img id="like_button" src="like_button.png" style="height:25%;width:35%"/>');
document.write('<div id="like_counter"></div>');
document.write('<img id="like_heart_icon" src="like.png" style="height:12%;width:21%"/>');


document.write('<div id="info_popup">');
document.write('<div id="info_text"></div>');


document.write('</div>');

document.write('<div id="iSpy_reserved_space"><BR><BR><BR>768 x 342 space reserved <BR> for iSpy video panel overlay</div>');

} // close doHTMLstuff()


function changeLowerRowSlideShow(stringContainingAllSlidesAsHTML){

noBreakTag =document.getElementById("temp");
noBreakTag.innerHTML=stringContainingAllSlidesAsHTML;

cross_slide=document.getElementById("test2");

cross_slide2=document.getElementById("test3");

cross_slide.style.left = "0px";


// Note: next line value should be -1000px to prevent CSS console error 
// BUT if you put this in, it puts a white space between images!! Leave it alone!
cross_slide2.style.top = "-1000";

cross_slide.innerHTML=cross_slide2.innerHTML=stringContainingAllSlidesAsHTML;

//console.log(copyspeed);

// Remember that offset width includes all of element plus its borders, padding etc
// Note: next previously used ternary operator - 
// if document.all (old IE version), then get width from existing slide, otherwise use temp.
// actualwidth=document.all? cross_slide.offsetWidth : document.getElementById("temp").offsetWidth

actualwidth=document.getElementById("temp").offsetWidth;

//console.log(leftrightslide);

cross_slide2.style.left=actualwidth+slideshowgap+"px"

// keep calling the slideleft function every 30 millisecs
// Don't forget this is not the speed of slideshow...
// it's more like the framerate of the animation

if (slideFrameRateCounterRunning==false)
{
slideFrameRateCounterRunning=true;
lefttime=setInterval("slideleft()",30);
}
else
{
clearInterval(lefttime);
//console.log("Was running...stopped!");
lefttime=setInterval("slideleft()",30);
}


} // close changeLowerRowSlideShow function



function slideleft(){

if (parseInt(cross_slide.style.left)>(actualwidth*(-1)+8))
cross_slide.style.left=parseInt(cross_slide.style.left)-copyspeed+"px"
else
cross_slide.style.left=parseInt(cross_slide2.style.left)+actualwidth+slideshowgap+"px"

if (parseInt(cross_slide2.style.left)>(actualwidth*(-1)+8))
cross_slide2.style.left=parseInt(cross_slide2.style.left)-copyspeed+"px"
else
cross_slide2.style.left=parseInt(cross_slide.style.left)+actualwidth+slideshowgap+"px"


} // close slideleft function



//==============================================================================

// TOUCH-INPUT EVENT LISTENERS

//==============================================================================

// On devices that support touch input, this function is triggered when the 
// user touches the screen.

function touchDownListener(e) {

// Note that this device supports touch so that we can prevent conflicts with
  
// mouse input events.
  

hasTouch = true;
   
  
// Determine where the user touched screen.
  

var event = e || window.event; 
 

// Get id of element associated with event
tname=event.target.id; 
//console.log(tname);


if(tname=="info")
{
document.getElementById("info_popup").style.visibility = 'visible';
keepInfoVisibleTimer=setInterval("hideInfoWindow()",millisecsToShowInfo);
return;

}


if(tname=="like_heart_icon")
{


if(autoSlideShowGroupedByTag)
{
setLikeCountFromImageURL(currentTopRowImageURL);
}
else
{
if(enableLikesForRegularAndTagButtonSlideShows)
setLikeCountFromImageURL(currentMediaFileNameForLikes);
}

if(autoSlideShowGroupedByTag)
{
broadcastLike();
}

return;

}


if(tname=="info_text" || tname=="info_popup" )
{
hideInfoWindow();
return;
}

//console.log("TouchDown");

// Check that it's an image being clicked/touched before trigging freeze 
if(event.target.toString()=="[object HTMLImageElement]")
{
if(autoSlideShowGroupedByTag)
{
freezeUnfreeze(true, tname);
}

/****** STEVE ADD ****/
else
{
if(touchImageCyclesNextSlide)
{
getNextSlideInRegularTransitionSlideShow();
}

//}
/****** STEVE ADD ****/


}



var touchX = e.changedTouches[0].clientX;
var touchY = e.changedTouches[0].clientY;

broadcastTouchPosition(touchX, touchY); 






}

  

}




function touchUpListener () {

// Do something...
//console.log("TouchUp");

}


//==============================================================================

// MOUSE-INPUT EVENT LISTENERS

//==============================================================================
 

// Triggered when the mouse is pressed down



function pointerDownListener (e) {
  

// If this is an iPhone, iPad, Android, or other touch-capable device, ignore
  
// simulated mouse input.
  

if (hasTouch) {
 return;
}

 // Retrieve a reference to the Event object for this mousedown event.
  
// Internet Explorer uses window.event; other browsers use the event parameter
 

var event = e || window.event; 
  

var tname

// Next gives element type not id
//tname=event.target;

// Get id of element associated with event
tname=event.target.id; 
//console.log(tname);

if(tname=="info")
{
document.getElementById("info_popup").style.visibility = 'visible';
keepInfoVisibleTimer=setInterval("hideInfoWindow()",millisecsToShowInfo);
return;

}

//if(tname=="like_button")
if(tname=="like_heart_icon")

{

//setRoomAttributeUpdate(currentTopRowImageURL, "62");

if(autoSlideShowGroupedByTag)
{
setLikeCountFromImageURL(currentTopRowImageURL);
}
else
{
if(enableLikesForRegularAndTagButtonSlideShows)
setLikeCountFromImageURL(currentMediaFileNameForLikes);
//setLikeCountFromImageURL(arrayOfImageURLs[curimg]);
}


if(autoSlideShowGroupedByTag)
{
broadcastLike();
}


return;

}

if(tname=="info_text" || tname=="info_popup" )

{
hideInfoWindow();
return;
}


//console.log("MouseDown");

// Determine where the user clicked the mouse.
 
// Check that it's an image being clicked/touched before trigging freeze 
if(event.target.toString()=="[object HTMLImageElement]")
{

if(autoSlideShowGroupedByTag)
{
freezeUnfreeze(true, tname);
}

/****** STEVE ADD ****/
else
{
if(touchImageCyclesNextSlide)
{
getNextSlideInRegularTransitionSlideShow();
}

}
/****** STEVE ADD ****/

}



var mouseX = event.clientX;
  
var mouseY = event.clientY;

broadcastTouchPosition(mouseX, mouseY ); 
 
}
  
  


// Triggered when the mouse moves

function pointerMoveListener(e) {
  

if (hasTouch) {
 return;
 }

//console.log("MouseMove");

// Retrieve a reference to the Event object for this mousedown event.
// Internet Explorer uses window.event; other browsers use the event parameter
var event = e || window.event; 

  

// Prevent default browser actions, such as text selection
  

if (event.preventDefault) 
{
    
event.preventDefault();
  
} else {
 return false;  // IE
 }


}



// Triggered when the mouse button is released


function pointerUpListener (e) {
  

if (hasTouch) { return;}

//console.log("MouseUp");

// Retrieve a reference to the Event object for this mousedown event.
// Internet Explorer uses window.event; other browsers use the event parameter

var event = e || window.event;

}



function freezeUnfreeze (localEvent,tname) {
 

if(slideShowFrozen==false)
{
keepFrozenTimer=setInterval("unFreeze()",millisecsTouchedSlideFrozenFor);
slideShowFrozen=true;
copyspeed=0;

var locationCode=getTwoDigitLocationCodeFromImageName(getImageNameFromImageURL(tname));
//console.log(locationCode);

doSomethingWithLocationCode (localEvent,locationCode);

getLikeCountFromImageURL(tname);

document.getElementById("like_heart_icon").style.visibility = 'visible';
document.getElementById("like_counter").style.visibility = 'visible';

// Check if the image touched is the topRowImage
if(tname!=currentTopRowImageURL)
{
// if touched is not current topRowImage, put touched image on topRow
changeTopRowImage(tname);
currentTopRowImageURL = tname;
}

if(localEvent==true)
{
broadcastSlideShowSnapshot(currentOneStringContainingAllSlideShowHTMLImageTagsWithGapsAndNoBreak, currentTopRowImageURL, currentTagCategory); 
}

}

else
{
slideShowFrozen = false;
clearInterval(keepFrozenTimer);
copyspeed=slidespeed;
//hideColouredLocationIndicators ();
document.getElementById("like_button").style.visibility = 'hidden';
document.getElementById("like_heart_icon").style.visibility = 'hidden';
document.getElementById("like_counter").style.visibility = 'hidden';

}
}

function unFreeze () {
slideShowFrozen = false;
clearInterval(keepFrozenTimer);
copyspeed=slidespeed;
//hideColouredLocationIndicators ();
document.getElementById("like_button").style.visibility = 'hidden';
document.getElementById("like_heart_icon").style.visibility = 'hidden';
document.getElementById("like_counter").style.visibility = 'hidden';

}


function initLayoutCustomComponents() {

// This is the container for everything
document.getElementById("jcontainer").style.top = jcontainerPositionFromTop + "px";
document.getElementById("jcontainer").style.height = experienceHeight + "px";
document.getElementById("jcontainer").style.width = experienceWidth + "px";

// This is ...
document.getElementById("info_popup").style.top = info_popupPositionFromTop + "px";
document.getElementById("info_popup").style.height = info_popupHeight + "px";
document.getElementById("info_popup").style.width = info_popupWidth + "px";

document.getElementById("info_text").innerHTML = textForInfoWindow;
document.getElementById("info_text").style.fontSize = textForInfoWindowFontSize + "px";
document.getElementById("info_text").style.top = textForInfoWindowPositionFromTop + "px";
document.getElementById("info_text").style.left = textForInfoWindowPositionFromLeft + "px";



// top_row_image

if (show_top_row_image) {
    document.getElementById("top_row_image").style.visibility = 'visible';
}
document.getElementById("top_row_image").style.top = top_row_image_PositionFromTop + "px";
document.getElementById("top_row_image").style.left = top_row_image_PositionFromLeft + "px";

// Message
if (showMessage) {
    document.getElementById("message").style.visibility = 'visible';
}
document.getElementById("message").style.top = tagNameLabelPositionFromTop + "px";
document.getElementById("message").style.fontSize = tagNameLabelFontSize + "px";
document.getElementById("message").style.left = tagNameLabelPositionFromLeft + "%";


// infoButton
if (showInfoButton) {
    document.getElementById("info").style.visibility = 'visible';
}
document.getElementById("info").style.top = infoButtonPositionFromTop + "px";
document.getElementById("info").style.left = infoButtonPositionFromLeft + "px";


// like_button
if (showLike_Button) {
    document.getElementById("like_button").style.visibility = 'visible';
}
document.getElementById("like_button").style.top = like_buttonPositionFromTop + "px";
document.getElementById("like_button").style.left = like_buttonPositionFromLeft + "px";

// like_heart_icon
if (showlike_heart_icon) {
    document.getElementById("like_heart_icon").style.visibility = 'visible';
}
document.getElementById("like_heart_icon").style.top = like_heart_iconPositionFromTop + "px";
document.getElementById("like_heart_icon").style.left = like_heart_iconPositionFromLeft + "px";

// like counter
if (showLikeCounter) {
    document.getElementById("like_counter").style.visibility = 'visible';
}
document.getElementById("like_counter").style.top = likeCounterPositionFromTop + "px";
document.getElementById("like_counter").style.fontSize = likeCounterFontSize + "px";
document.getElementById("like_counter").style.left = likeCounterPositionFromLeft + "px";
document.getElementById("like_counter").innerHTML=likeCounterValue;


// iSpy_reserved_space
if (showISpy_reserved_space) {
    document.getElementById("iSpy_reserved_space").style.visibility = 'visible';
}

}


function hideInfoWindow()
{
document.getElementById("info_popup").style.visibility = 'hidden';
clearInterval(keepInfoVisibleTimer);

}


function doSomethingWithLocationCode (messageIsLocal,locationCode) {

var introText;


if (messageIsLocal == true)
{
introText = ifTouchedLocationIntroText;
}
 else
 {

introText = photoShowingStartTxt+locationOfRempoteScreenSendingUsMessage+photoShowingEndTxt;

 }


if(locationCode=="WA") 
{
//console.log(locationIntroText+WalthamstowLocationDescription);
notify(introText+WalthamstowLocationDescription,timeUntilShowPhotoNotificationFades);

}


else if(locationCode=="LE") 
{
//console.log(locationIntroText+LeytonstoneLocationDescription);
notify(introText+LeytonstoneLocationDescription,timeUntilShowPhotoNotificationFades);

}

else if(locationCode=="BW") 
{
//console.log(locationIntroText+BroadwayLocationDescription);
notify(introText+BroadwayLocationDescription,timeUntilShowPhotoNotificationFades);


}

else if(locationCode=="NA") 
{
//console.log(locationIntroText+NewArtExchangeLocationDescription);
notify(introText+NewArtExchangeLocationDescription,timeUntilShowPhotoNotificationFades);

}

else 
{
//console.log(locationIntroText+"unknown");
notify(introText+"unknown",timeUntilShowPhotoNotificationFades);
}

}

function notify (notification,removeTimer) {

 var notice = '<div class="notice">'
 + '<div class="notice-body">'
 + '<img src="info2.png" />'
 + '<p>'+notification+'</p>'
 + '</div>'
 + '<div class="notice-bottom">'
 + '</div>'
 + '</div>';
 $( notice ).purr(
    {
    fadeInSpeed: 200,
    fadeOutSpeed: 2000,
  removeTimer: 2000,
// Steve added next option, so that I can disable list covering screen...
  disableListOfNotifications: useSingleNotificationNotList
    }
  );
  


  }

  
  function changeTopRowImage(imageURL) {

// Get rid of children of node (former images)...might be a better way to do this?
document.getElementById("top_row_image").innerHTML = "";
var image = document.createElement("img");
image.src = imageURL;
image.id = imageURL;
image.style.height = top_row_image_Height + "px";
image.style.width = top_row_image_Width + "px";

document.getElementById("top_row_image").appendChild(image);
  
    }
  



// Initialize Orbiter, which handles multiuser communications
function initUnion () {
  // Create the Orbiter instance, used to connect to and communicate with Union
  orbiter = new net.user1.orbiter.Orbiter();

  // If required JavaScript capabilities are missing, abort
  if (!orbiter.getSystem().isJavaScriptCompatible()) {
    return;
  }
  
  // Register for Orbiter's connection events
  orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.READY, readyListener, this);
  orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.CLOSE, closeListener, this);

  // Retrieve a reference to the MessageManager, used for sending messages to
  // and receiving messages from Union Server
  msgManager = orbiter.getMessageManager();
  
  orbiter.connect(server, port);

}

//==============================================================================
// UNION ORBITER EVENT LISTENERS
//==============================================================================
// Triggered when the connection to Union Server is ready
function readyListener (e) {
 
console.log("Connected to UNION");
 

 // Register for UPC messages from Union Server
  msgManager.addMessageListener(UPC.JOINED_ROOM, joinedRoomListener, this);
  
  // Register for custom messages from other users
  msgManager.addMessageListener(Messages.SLIDESHOWSNAPSHOT, SlideShowSnapshotMessageListener, this, [roomID]);
  msgManager.addMessageListener(Messages.LIKE, LikeMessageListener, this, [roomID]);
  
  // Create a room for the experience app, then join it
 msgManager.sendUPC(UPC.CREATE_ROOM, roomID);
  msgManager.sendUPC(UPC.JOIN_ROOM, roomID);
}

// Triggered when the connection to Union Server is closed
function closeListener (e) {

   console.log("Disconnected from UNION");


// do something...

}

// Triggered when this client has joined the server-side experience room
function joinedRoomListener (roomID) {

console.log("Joined UNION experience");

// do something...

}

// Triggered when a remote client sends a "MOVE" message to this client
function SlideShowSnapshotMessageListener(fromClientID, valuesString) {

 console.log("Receiving slideshow snapshot...");


  // Parse the specified (x, y) coordinate
  var values = valuesString.split(",");
  

currentOneStringContainingAllSlideShowHTMLImageTagsWithGapsAndNoBreak = values[0];
changeLowerRowSlideShow(currentOneStringContainingAllSlideShowHTMLImageTagsWithGapsAndNoBreak);

currentTopRowImageURL = values[1];
changeTopRowImage(currentTopRowImageURL);


currentTagCategory = values[2];
document.getElementById("message").innerHTML = currentTagCategory;

locationOfRempoteScreenSendingUsMessage = translateTwoDigitLocationCodeIntoTextString (values[3]);

freezeUnfreeze (false,currentTopRowImageURL);

}


function LikeMessageListener (fromClientID, valuesString) {

 console.log("Receiving like notification...");

var values = valuesString.split(",");

var locationCode = values[0];

notify(LikeNotifyStartTxt+translateTwoDigitLocationCodeIntoTextString (values[0])+LikeNotifyEndTxt,timeUntilRemoteLikeNotificationFades);

getLikeCountFromImageURL(currentTopRowImageURL);

}


function broadcastLike() {

        console.log("Sending clients my like...");

		// Note: below param set 'false' means that this client won't get told about this event!
		msgManager.sendUPC(UPC.SEND_MESSAGE_TO_ROOMS,
					Messages.LIKE, 
                     roomID, 
                     "false", 
                     "", 
                     getURLparameterValue("loc"));
}



function broadcastSlideShowSnapshot(slideshowHTMLString, topRowImageURL, tag) {

        console.log("Sending clients snapshot of my slideshow...");

		// Note: below param set 'false' means that this client won't get told about this event!
		msgManager.sendUPC(UPC.SEND_MESSAGE_TO_ROOMS, 
                     Messages.SLIDESHOWSNAPSHOT, 
                     roomID, 
                     "false", 
                     "", 
                     slideshowHTMLString + "," + topRowImageURL + "," + tag+ "," +getURLparameterValue("loc"));
}



// Sends all users in the experience room an instruction to reposition the local user

function broadcastTouchPosition(x, y) {

        console.log("Telling remote clients where screen was touched...");

		msgManager.sendUPC(UPC.SEND_MESSAGE_TO_ROOMS, 
                     Messages.POSITION, 
                     roomID, 
                     "false", 
                     "", 
                     x + "," + y + "," +getURLparameterValue("loc"));
}



/* ########################## Helper Functions ################################## */


function getURLparameterValue( param )
{
param = param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
var regexS = "[\\?&]"+param+"=([^&#]*)";  
var regex = new RegExp( regexS );  
var results = regex.exec( window.location.href ); 
 if( results == null )    return "";  
else    return results[1];
}


function translateTwoDigitLocationCodeIntoTextString (location) {

var loc;

if (location == "NA")
{
loc = NewArtExchangeLocationDescription;
}

else if (location == "BW")
{
loc = BroadwayLocationDescription;
}

else if (location == "LE")
{
loc = LeytonstoneLocationDescription;
}

else if (location == "WA")
{
loc = WalthamstowLocationDescription;
}

else
{
loc = "Unknown Location";
}

return loc;
//alert(screenLocation);

}

  function changecss(myclass,element,value) {
	var CSSRules
	if (document.all) {
		CSSRules = 'rules'
	}
	else if (document.getElementById) {
		CSSRules = 'cssRules'
	}
	for (var i = 0; i < document.styleSheets[0][CSSRules].length; i++) {
		if (document.styleSheets[0][CSSRules][i].selectorText == myclass) {
			document.styleSheets[0][CSSRules][i].style[element] = value
		}
	}	
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function getImageNameFromImageURL (image_url) {
var arrayIndexOfLastForwardSlashinURL = image_url.lastIndexOf("/");
return image_url.substring(arrayIndexOfLastForwardSlashinURL+1);
}

function getTwoDigitLocationCodeFromImageName (image_name) {
var arrayIndexOfFirstUnderscoreInImageName = image_name.indexOf("_");
return image_name.substring(arrayIndexOfFirstUnderscoreInImageName+1,arrayIndexOfFirstUnderscoreInImageName+3);
}

function getURLfromHTMLimageTag(imageTag) {
// find the first open speech marks in HTML image tag
var arrayIndexOfFirstOpenSpeechMarksInImageName = imageTag.indexOf("\"");
// find the second open speech marks in HTML image tag - starting from index of first one
var arrayIndexOfSecondSpeechMarksInImageName = imageTag.indexOf("\"",arrayIndexOfFirstOpenSpeechMarksInImageName+1);
// return substring between first set of speech marks, as this is URL of image
return imageTag.substring(arrayIndexOfFirstOpenSpeechMarksInImageName+1,arrayIndexOfSecondSpeechMarksInImageName);
}





function getLikeCountFromImageURL(mediaFilename)
{

// Strip out all carriage returns...
mediaFilename = mediaFilename.replace(/\r?\n|\r/g, '');

//console.log("getting count for "+mediaFilename);

mediaFilename = getImageNameFromImageURL (mediaFilename);

document.getElementById("like_counter").innerHTML = 'loading...';

//notify("Getting 'likes'...",50);

xmlhttp=new XMLHttpRequest();
xmlhttp.onreadystatechange=function()
{

if (xmlhttp.readyState==4 && xmlhttp.status==200)
{

var likes = xmlhttp.responseText;

// This checks if return is just a bunch of string space
// When imageURL is not found by MySQL, 
// xmlhttp.responseText seems to just be a string of length = 3.
// So, this triggers if image should have zero likes...
if(likes.replace(/\s/g,"") == "")
{
// set likes to zero
likes = "0";
}
document.getElementById("like_counter").innerHTML = likes;

}
}

//xmlhttp.open("GET", MySQLdataBaseHost+"/getLikeCountForImage.php?image="+imageURL,true);
xmlhttp.open("GET", "getLikeCountForImage.php?mediaFilename="+mediaFilename,true);

xmlhttp.send();

}

function setLikeCountFromImageURL(mediaFilename)
{

// Strip out all carriage returns...
mediaFilename = mediaFilename.replace(/\r?\n|\r/g, '');

//console.log("Setting count for "+mediaFilename);

var imageAndURL = mediaFilename;

mediaFilename = getImageNameFromImageURL (mediaFilename);

//var url = MySQLdataBaseHost+"/setLikeCountForImage.php";
var url = "setLikeCountForImage.php";
var params = "mediaFilename="+mediaFilename; 

xmlhttp=new XMLHttpRequest();

xmlhttp.open("POST", url, true);

//Send the proper header information along with the request
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.setRequestHeader("Content-length", params.length);
xmlhttp.setRequestHeader("Connection", "close");

xmlhttp.onreadystatechange=function()
{

if (xmlhttp.readyState==4 && xmlhttp.status==200)
{
//console.log("here");
getLikeCountFromImageURL(imageAndURL);
//console.log(xmlhttp.responseText);
}
}
xmlhttp.send(params);

// refresh like counter to reflect increment
getLikeCountFromImageURL(imageAndURL);
}


function toggle(id) {

clearInterval(regularTransitionSlideTimer);

for(i=0; i<tags.length; i++)	
{
document.getElementById(tags[i]).style.background = "transparent";
}

document.getElementById(id).style.background = "red";

doRegularTransitionSlideShow (id);


}



