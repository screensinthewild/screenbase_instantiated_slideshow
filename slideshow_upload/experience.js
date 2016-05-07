

function init () {

//alert("here!");

doHTMLstuff();

}



function doHTMLstuff() {

document.write(startMessage); 

document.write('<div id="uploader_interface_form">');

document.write(uploaderNameToDisplay);

//if(useFileSizeLimit!="false")
if(useFileSizeLimit=="true")
{
document.write('Image file size is limited to: '+max_size+' Kilobytes <BR><BR>'); 
}

//if(useAutoResize!="false")
if(useAutoResize=="true")
{
document.write('Image pixel size is set to width= '+max_width+' and height= '+max_height+'<BR><BR>'); 
document.write('If your image is not this size it may be cropped. Make sure "the interesting bit" happens near to the centre of the image!<BR><BR>'); 
}

// Start form...
document.write('<form method="post" enctype="multipart/form-data"  action="">');

document.write('<fieldset>');

// Hidden values - sending params to PHP, when form is submitted...
document.write('<input type="hidden" name="max_size" value="'+max_size+'">');
document.write('<input type="hidden" name="resize_height" value="'+max_height+'">');
document.write('<input type="hidden" name="resize_width" value="'+max_width+'">');
document.write('<input type="hidden" name="useAutoResize" value="'+useAutoResize+'">');
document.write('<input type="hidden" name="useFileSizeLimit" value="'+useFileSizeLimit+'">');
document.write('<input type="hidden" name="filePathToMediaStore" value="'+filePathToMediaStore+'">');
document.write('<input type="hidden" name="useImageAutoFileRename" value="'+useImageAutoFileRename+'">');

// Note: next line hard-coded to mediaType = image. If ever use other file types, this would need to be dynamic
document.write('<input type="hidden" name="mediaType" value="image">');

// Select an image
document.write('<label for="image">Select an image: </label>');
document.write('<input type="file" name="image"><BR>');

// Label for image
if(useImageLabels)
{
document.write('<label for="imageLabel">Type a short text label to appear with your image: </label>');
document.write('<input type="text" name="imageLabel"><BR><BR>');
}

// Select location image was taken...nearest screen 
if(useLocation)
 {
document.write('<label for="location">Select the nearest SiTW screen to you: </label>');
document.write('<select name="location">');
document.write('<option value=""></option>');
i=0;
while (locations[i])
{
document.write('<option value="'+locationCodes[i]+'">'+locations[i]+'</option>');
i++;
} //  close while something to use for drop-down loop
document.write('</select><BR><BR>');
} // close if used loop

// Select tag for image
if(useTags)
 {  
document.write('<label for="tag">Select a tag for your image: </label>');	
document.write('<select name="tag">');
document.write('<option value=""></option>');
i=0;
while (tags[i])
{
// if category lable is enabled, then send corresponding label with tag, as one value to be split in PHP
if(useCategoryLabels)
document.write('<option value="'+tags[i]+'&'+categoryLabels[i]+'">'+tags[i]+'</option>');
else
document.write('<option value="'+tags[i]+'">'+tags[i]+'</option>');
i++;
} //close while something to use for drop-down loop
document.write('</select><BR><BR>');
} // close if used loop

// Select app that this image is intended for


if(useAppName)
{
document.write('<label for="appName">Select the App/Experience that your image will be used with: </label>');
document.write('<select name="appName">');
document.write('<option value=""></option>');
i=0;
while (appNames[i])
{
document.write('<option value="'+appNames[i]+'">'+appNames[i]+'</option>');
i++;
} //close while something to use for drop-down loop
document.write('</select><BR><BR>');
} // close if used loop

else
// useAppName is FALSE...use the hard-coded app name from config file
{
document.write('<input type="hidden" name="appName" value="'+fixedAppName+'">');
}


// Type user's name to go with image
if(useUserName)
{
document.write('<label for="fileownersname">Type your name: </label>');
document.write('<input type="text" name="fileownersname"><BR>');
} // close if used loop

// Submit image and meta data
document.write('<input name="Submit" type="submit" value="Upload image">');
		
document.write('</fieldset>');
document.write('</form>');


document.write('</div>');

} // close doHTMLstuff()