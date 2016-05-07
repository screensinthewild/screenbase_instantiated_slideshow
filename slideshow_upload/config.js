


var filePathToMediaStore = "../../../images/";

var startMessage = "<h1>Select Image File</h1>";

var uploaderNameToDisplay = "<h1>ScreenBase Uploader</h1>";

// max file size in KiloBytes
var max_size = "1750";

//var max_height = "1340";
//var max_width = "750";

var max_height = "884";
var max_width = "745";

// Will use max_height and max_width only if following is enabled:
var useAutoResize = "true";

var useFileSizeLimit = "true";


// This controls what elements are displayed in the form
var useImageLabels = true;
var useLocation = true;
var useTags = true;
var useAppName = true;
var useUserName = true;

// if following is true, then image's filename will be replace with an auto name in the format:
// 6th-May-2013-11-48-11_WA_12_RandomPics_SteveNorth.png
var useImageAutoFileRename = "true";

var useCategoryLabels = true;

// Only does anything if useAppName (user selects from dropdown) is set FALSE...
var fixedAppName = "screenbase";

var tags = new Array();

var categoryLabels = new Array();

var locations = new Array();

var locationCodes = new Array();

var appNames = new Array();

tags[0] = "TestTag1";
categoryLabels[0] = "TestTagLabel1";

tags[1] = "TestTag2";
categoryLabels[1] = "TestTagLabel2";

tags[2] = "TestTag3";
categoryLabels[2] = "TestTagLabel3";

locations[0] = "New Art Exchange, Nottingham";
locations[1] = "The Mill, Walthamstow, London";
locations[2] = "Leytonstone Library, London";
locations[3] = "Broadway Cinema, Nottingham";

locationCodes[0] = "NA";
locationCodes[1] = "WA";
locationCodes[2] = "LE";
locationCodes[3] = "BW";



appNames[0] = "dfuse";
appNames[1] = "screenbase";
appNames[2] = "scratchpad";

// Notes on how image resizing works follow...

/*
There are four sets of image dimensions to consider here...
1. The TARGET IMAGE - the hard-coded image size, as passed to this function as $targetImage_width and $targetImage_height. These originally come from $RESIZE_WIDTH and $RESIZE_HEIGHT, which are specified in config.js. 
2. The INPUT IMAGE - this is the one that the user is trying to upload.
3. The INTERMEDIATE IMAGE - this is a temporary step where the INPUT IMAGE is resize (using one dimension of the TARGET IMAGE), but still retains the aspect ratio of the INPUT IMAGE and so does not match the required dimensions of the TARGET IMAGE.
4. The OUTPUT IMAGE - this is output of this function.

Summary:
Phase 1 - create an INTERMEDIATE IMAGE, which is a version of the INPUT IMAGE, resized to use the longest dimension of the TARGET IMAGE, whilst still using the aspect ratio of the INPUT IMAGE.
So, this results in an INTERMEDIATE IMAGE that is definitely long enough in its dimension that corresponds to the longer dimension in the TARGET IMAGE and it has retained the aspect ratio of the original, so it's not distorted. However, it still needs cropping in the other dimension to match the TARGET IMAGE'S size (and thus aspect ratio). 
By choosing the longest of the TARGET IMAGE's dimensions for the INTERMEDIATE IMAGE, it is assured that there is enough of the other dimension available for cropping.  
Note: using the shorter dimension of the TARGET IMAGE, will result in a smaller INTERMEDIATE IMAGE, with a lower resolution. 

The test to find which dimension of the TARGET IMAGE to apply to the ITERMEDIATE IMAGE, do the following-
Calculate the digital aspect ratios of both the TARGET IMAGE and the INPUT IMAGE. This is width divided by height. 

If (TARGET IMAGE_ASPECT RATIO > INPUT IMAGE_ASPECT RATIO)
{use TARGET IMAGE's width because the TARGET IMAGE is wider relative to its height than the INPUT IMAGE}
if ((TARGET IMAGE_ASPECT RATIO <= INPUT IMAGE_ASPECT RATIO)
{use TARGET IMAGE's height because the TARGET IMAGE is the same or higher relative to its width than the INPUT IMAGE}

Now, we need to resize the INTERMEDIATE IMAGE to the same dimensions as the TARGET IMAGE, 
while trying to avoid ruining the INPUT IMAGE (!)...

Phase 2 - 
Find the middle of the TARGET IMAGE's height and the middle of the TARGET IMAGE's height.
Find the middle of the IMTERMEDIATE IMAGE's height and the middle of the IMTERMEDIATE IMAGE's height.

Calculate: the IMTERMEDIATE IMAGE height middle value minus TARGET IMAGE height middle value. This gives you a height point on the INTERMEDIATE IMAGE to make the top point (y=0) in the OUTPUT IMAGE.

Calculate: the IMTERMEDIATE IMAGE width middle value minus TARGET IMAGE width middle value. This gives you a width point on the INTERMEDIATE IMAGE to make the edge point (x=0) in the OUTPUT IMAGE.

This makes sure that OUTPUT IMAGE that will include the centre of the INPUT IMAGE (more likely to include "the action").

Phase 3 - 
Crop the INTERMEDIATE IMAGE (using the starting coordinates identified in Phase 2) to produce the final OUTPUT IMAGE.

Note:
Note: when aspect ratios are given as digital (such as 1.33), they mean that the width is 1.33 times bigger than the height.
So, they could also be written as 1.33:1. The ratio version is achieved by finding the lowest multiplying value which will give you 
(rounded) whole numbers on each side of the ratio divider (:). So, for 1.33:1 this multiplying value is "3" and it becomes 4:3.
This is because 1.33rec x 3 = 3.99rec rounded to 4 and 3 x 1 = 3...hence 4:3. This reverses as 4 divided by 3 =  1.33rec and we're back to 1.33:1.

Most DSLR cameras use an aspect ratio of 3:2 (1.5) 
Most other digital cameras use 4:3 (digital = 1.33r)

*/

