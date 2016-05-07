<?php

$filePathToMediaStore = "../../../images/";

$mediaFilename=$_POST["mediafilename"];

debug($mediaFilename);

$con = mysql_connect("<database host>","<database username>","<database password>");

//mysql_connect(servername,username,password); 

if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
 
mysql_select_db("<database name>", $con);

// NOTE: Next line is crucial...without won't work between diff domains!
// header('Access-Control-Allow-Origin: *');


$sql="DELETE FROM media WHERE mediaFilename='$mediaFilename'";

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }

$sql="DELETE FROM tags WHERE mediaFilename='$mediaFilename'";

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }  
  
mysql_close($con);

// and now...actually delete the file from the media store...!!! 
// File permissions need to allow this for the relevant directory on the server

if(unlink($filePathToMediaStore.$mediaFilename))
debug($filePathToMediaStore.$mediaFilename." File Deleted.");
else
debug($filePathToMediaStore.$mediaFilename." File Not Deleted.");


	function debug($data) {
$file = 'debug.out';
file_put_contents($file, $data);
}


?> 

