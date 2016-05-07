<?php

$mediaFilename=$_POST["mediaFilename"];

$con = mysql_connect("<database host>","<database username>","<database password>");

if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

mysql_select_db("<database name>", $con);

// NOTE: Next line is crucial...without won't work between diff domains!
// header('Access-Control-Allow-Origin: *');

$sql = "UPDATE media SET likeCount = likeCount+1 WHERE mediaFilename = '$mediaFilename'";


if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }
// echo "1 record added";
//debug($sql);

mysql_close($con);


function debug($data) {
$file = 'debug.out';
file_put_contents($file, $data);
}


?> 

