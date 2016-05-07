<?php

$mediaFilename=$_GET["mediaFilename"];

$con = mysql_connect("<database host>","<database username>","<database password>");

//mysql_connect(servername,username,password); 
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
 
mysql_select_db("<database name>", $con);

$result = mysql_query("SELECT likeCount FROM media WHERE mediaFilename='$mediaFilename'");

// NOTE: Next line is crucial...without won't work between diff domains!
header('Access-Control-Allow-Origin: *');

while($row = mysql_fetch_array($result))
  {
  
  if (empty($row)) {
    echo "empty";
} else {
    echo $row['likeCount'];
}
  
 // echo $row['likeCount'];
 // echo "<br />";
  }

mysql_close($con);


function debug($data) {
$file = 'debug.out';
file_put_contents($file, $data);
}


?> 

