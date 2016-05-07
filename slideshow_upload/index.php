<?php

// Note: better here, rather than in config.js, because harder for user to read. Can't easily view source on PHP.
$servername = "<database host>";
$username = "<database username>";
$password = "<database password>";
  
$image;
$tag;
$imageLabel;
$location;
$appName;
$fileownersname;
$MAX_SIZE;
$RESIZE_HEIGHT;
$RESIZE_WIDTH;
$useAutoResize;
$useFileSizeLimit;
$filePathToMediaStore;
$mediaType;
$useImageAutoFileRename;

  
//This function reads the extension of the file. It is used to determine if the file  is an image by checking the extension.
 function getExtension($str) {
         $i = strrpos($str,".");
         if (!$i) { return ""; }
         $l = strlen($str) - $i;
         $ext = substr($str,$i+1,$l);
         return $ext;
 }
  
//This variable is used as a flag. The value is initialized with 0 (meaning no error  found) 
//and it will be changed to 1 if an errro occures. 
//If the error occures the file will not be uploaded.
 $errors=0;
//checks if the form has been submitted
 if(isset($_POST['Submit']))
 {
 
 	// Do this so is global for later...
    global $image;
	global $tag;
    global $imageLabel;
	global $location;
	global $appName;
	global $fileownersname;
	global $categoryLabel;
	global $MAX_SIZE;
	global $RESIZE_HEIGHT;
	global $RESIZE_WIDTH;
	global $useAutoResize;
	global $useFileSizeLimit;
	global $filePathToMediaStore;
	global $mediaType;
	global $useImageAutoFileRename;
	
	$mediaType = $_POST['mediaType'];
	$MAX_SIZE = $_POST['max_size'];
	$RESIZE_HEIGHT = $_POST['resize_height'];
	$RESIZE_WIDTH = $_POST['resize_width'];

	$filePathToMediaStore = $_POST['filePathToMediaStore'];
	
	$useAutoResize = $_POST['useAutoResize'];
	$useFileSizeLimit = $_POST['useFileSizeLimit'];
	
//echo 'test1'+$MAX_SIZE;

	
	//reads the name of the file the user submitted for uploading
    $image=$_FILES['image']['name'];
    //if it is not empty
	
// the tag and its label may be in the same string, separated by &. So, put in temp string and split	
	$tempString = $_POST['tag'];
	
	// split string, using & as limiter
	list($tag, $categoryLabel) = explode('&', $tempString);
		
	$imageLabel = $_POST['imageLabel'];
	$location = $_POST['location'];
	$appName = $_POST['appName'];
	$fileownersname = $_POST['fileownersname'];
	$useImageAutoFileRename = $_POST['useImageAutoFileRename'];
	
	
    if ($image)
    {
    //get the original name of the file from the clients machine
        $filename = stripslashes($_FILES['image']['name']);
    //get the extension of the file in a lower case format
        $extension = getExtension($filename);
        $extension = strtolower($extension);
    //if it is not a known extension, we will suppose it is an error and will not  upload the file, 
    //otherwise we will do more tests
    if (($extension != "jpg") && ($extension != "jpeg") && ($extension != "png") && ($extension != "gif"))
        {
        //print error message
            echo '<h1>Unknown extension!</h1>';
            $errors=1;
        }
    else
        {
            //get the size of the image in bytes
            //$_FILES['image']['tmp_name'] is the temporary filename of the file
            //in which the uploaded file was stored on the server
   
  // echo $useFileSizeLimit;
   
   if($useFileSizeLimit=="true")
   {
   $size=filesize($_FILES['image']['tmp_name']);
   }
   else
   // Hack to disable file size limit...if $size=0, will alway fail if($size > $MAX_SIZE) in next bit
   {
   $size=0;
   }
 
 // Convert from KiloBytes to Bytes 
$MAX_SIZE=$MAX_SIZE*1024;

 //echo "Maximum size =".$MAX_SIZE." and size of this file =".$size;
// echo $useAutoResize;
  
            //compare the size with the maxim size we defined and print error if bigger
            //if ($size > MAX_SIZE*1024)
			//if ($size > $MAX_SIZE*1024)
			if ($size > $MAX_SIZE)
            {
                echo '<h1>You have exceeded the size limit!</h1>';
                $errors=1;
            }
  
            else{
            //the new name will be containing the full path where will be stored (images folder)

			
			if($useAutoResize=="true")
			{
			// resize it
			$temp=resizeImage($_FILES['image']['tmp_name'],$RESIZE_WIDTH,$RESIZE_HEIGHT);
            }
			else
			{
			// don't resize it
			$temp = imagecreatefromjpeg($_FILES['image']['tmp_name']);
			}
			
			//Strip internal whitespace from fileownersname			
			$fileownersname_noSpace = str_replace (" ", "", $fileownersname);
			
			//creates something like: 6th-May-2013-11-48-11_WA_12_RandomPics_SteveNorth.png
			$newImageFilename = gmdate("jS-F-Y-h-i-s").'_'.$location.'_'.$tag.'_'.$fileownersname_noSpace.'.'.$extension;
			
 
 			if($useImageAutoFileRename=="true")
			{
			//creates something like: 6th-May-2013-11-48-11_WA_12_RandomPics_SteveNorth.png
			$image = gmdate("jS-F-Y-h-i-s").'_'.$location.'_'.$tag.'_'.$fileownersname_noSpace.'.'.$extension;
			}
			
			$imgfile=$filePathToMediaStore.$image;
 
 
  //  imagejpeg ( $temp, $imgfile );
// 100 is 100% JPEG quality
  imagejpeg ( $temp, $imgfile,100 );

// Steve add to fix problem with image permissions once on server  
chmod($imgfile, 0777);
	
			addEntryToMySQL();
			
            }
  
  
        }
    }
  
    else
    {
        echo "<h1>Select Image File</h1>";
        $errors=1;
    }
	
	}
  
//If no errors registred, print the success message
 if(isset($_POST['Submit']) && !$errors)
 {
    echo "<h1>File Uploaded Successfully!</h1>";
 }
  
   
   
function resizeImage($inputImage_file_reference,$targetImage_width,$targetImage_height) { 

//$inputImage_file_reference is a FILE - Returns an image resource.

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

    //get the Input Image dimensions 
    list($inputImage_width, $inputImage_height) = getimagesize($inputImage_file_reference);  
  
// create an image from Input File reference, to do stuff with 
  $inputImage = imagecreatefromjpeg($inputImage_file_reference);
  
// work out the digital aspect ratio of the Input Image
  $inputImage_digital_aspect_ratio = $inputImage_width/$inputImage_height;
      
	// work out the digital aspect ratio of the Target Image
	$targetImage_digital_aspect_ratio =  $targetImage_width/$targetImage_height; 
	
// This is kind of the start of Phase 1...working out the dimensions for the INTERMEDIATE IMAGE...
	
// Does the TARGET IMAGE or the INPUT IMAGE have a larger digital aspect ratio? 
	  
    if ($targetImage_digital_aspect_ratio > $inputImage_digital_aspect_ratio) {
	
	// TARGET IMAGE is larger than the INPUT IMAGE ratio!!!
	// So...use TARGET IMAGE's width for the temp INTERMEDIATE IMAGE, because the TARGET IMAGE is wider relative to its height than the INPUT IMAGE
	$intermediateImage_width = $targetImage_width;
	
	// and adjust the TARGET IMAGE'S height value, so that the INTERMEDIATE IMAGE's height reflects the aspect ratio of the INPUT IMAGE.
	$intermediateImage_height = $targetImage_width/$inputImage_digital_aspect_ratio;
       
    } else {
	
	// TARGET IMAGE ratio is the same or smaller than the INPUT IMAGE ratio!!!
	// So...use TARGET IMAGE's height for the temp INTERMEDIATE IMAGE, because the TARGET IMAGE is wider relative to its height than the INPUT IMAGE
	  $intermediateImage_height = $targetImage_height;
	   
      // and adjust the TARGET IMAGE's width value, so that the INTERMEDIATE IMAGE's width reflects the aspect ratio of the INPUT IMAGE.
	  $intermediateImage_width = $targetImage_height*$inputImage_digital_aspect_ratio;
      
    }
     
     // Phase 2 starts here...
	 
	// Find the centre point of the TARGET IMAGE
	$targetImage_width_middle_point = $targetImage_width/2; //horizontal middle
    $targetImage_height_middle_point = $targetImage_height/2; //vertical middle 	
	
	// Find the centre point of the INTERMEDIATE IMAGE
	$intermediateImage_width_middle_point = $intermediateImage_width/2;  //horizontal middle
    $intermediateImage_height_middle_point = $intermediateImage_height/2; //vertical middle
	
	// create a blank image to take the INTERMEDIATE IMAGE
	$intermediateImage = imagecreatetruecolor(round($intermediateImage_width), round($intermediateImage_height));
      
	// copy the INPUT IMAGE into the INTERMEDIATE IMAGE, using the new sizing, based on the TARGET IMAGE  
    // Note: only one of the dimensions of the INTERMEDIATE IMAGE currently matches the TARGET IMAGE 
	// and the INTERMEDIATE IMAGE does not (yet) match the aspect ratio of the TARGET IMAGE.	
    
	imagecopyresampled($intermediateImage,$inputImage, 0, 0, 0, 0, $intermediateImage_width, $intermediateImage_height, $inputImage_width, $inputImage_height);
    
	// create a blank image to take the OUTPUT IMAGE
	$outputImage = imagecreatetruecolor($targetImage_width, $targetImage_height);
    
	// copy the INTERMEDIATE IMAGE into the OUTPUT IMAGE, using the middle points to work out the
	// coords on the INTERMEDIATE IMAGE to start copying to the OUTPUT IMAGE, so that any cropped bits are at the edges. 
	
	imagecopyresampled($outputImage, $intermediateImage, 0, 0, ($intermediateImage_width_middle_point-$targetImage_width_middle_point),($intermediateImage_height_middle_point-$targetImage_height_middle_point),$targetImage_width,$targetImage_height,$targetImage_width, $targetImage_height);
  
  
  // Don't need these any more...
    imagedestroy($inputImage);
    imagedestroy($intermediateImage);
    
// Return OUTPUT IMAGE of size and aspect ratio that matches the TARGET IMAGE - note: ORIGINAL IMAGE will now be cropped.
	return $outputImage;
}

function addEntryToMySQL()
{

global $image;
global $tag;
global $imageLabel;
global $location;
global $appName;
global $fileownersname;
global $categoryLabel;
global $mediaType;

global $servername;
global $username;
global $password;


$con = mysql_connect($servername,$username,$password);

//mysql_connect(servername,username,password); 

if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
 
mysql_select_db("snn", $con);


// NOTE: Next line is crucial...without won't work between diff domains!
// header('Access-Control-Allow-Origin: *');



// ##############  START WRITE TO MYSQL 'MEDIA' TABLE ###############################

// Fields on database table "media" are:
// mediaFilename | likeCount | dateCreated | textLabel | location | appName | mediaType | personName |

if(!$imageLabel)
{
$imageLabel="NULL";
}

if(!$location)
{
$location="NULL";
}

if(!$appName)
{
$appName="NULL";
}

if(!$mediaType)
{
$mediaType="NULL";
}

if(!$fileownersname)
{
$fileownersname="NULL";
}


//$sql="REPLACE INTO media (mediaFilename,textLabel,location,appName,mediaType,personName) VALUES ('$image','$imageLabel','$location','$appName','$mediaType','$fileownersname')";
$sql="REPLACE INTO media (mediaFilename,likeCount,textLabel,location,appName,mediaType,personName) VALUES ('$image','0','$imageLabel','$location','$appName','$mediaType','$fileownersname')";

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }
 // ##############  END WRITE TO MYSQL 'MEDIA' TABLE ###############################



 
  
// ##############  START WRITE TO MYSQL 'TAGS' TABLE ###############################

// Fields on database table "tags" are:
// | mediaFilename | tag  | appName | categoryLabel |

// Check that $tag has a value. Don't write to the 'tags' table with just the value for $image and no tag.
if($tag)
{

if(!$appName)
{
$appName="NULL";
}

if(!$categoryLabel)
{
$categoryLabel="NULL";
}

$sql="REPLACE INTO tags (mediaFilename,tag,appName,categoryLabel) VALUES ('$image','$tag','$appName','$categoryLabel')";

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }

}  // close - if $tag has a value check loop
  
// ##############  END WRITE TO MYSQL 'TAGS' TABLE ###############################

  
mysql_close($con);

}

 ?>
  
 
 
 <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<html>
<head>

<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">

<title>ScreenBase Uploader</title>

<script type="text/javascript" src="config.js"></script>

<script type="text/javascript" src="experience.js"></script>

<link rel="stylesheet" type="text/css" href="style.css">

<script type="text/javascript">
init();
</script>

</head>

<body>
 

 
 </body>
 
 </html>
 