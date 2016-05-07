<?php

/********************** START CONFIG **************************/

// Use next two lines to create a version of the admin module 
// that only allows access to media items for a particular app or experience

$limitSearchToApp = false;
$appName = "dfuse";

/********************** END CONFIG **************************/

$con = mysql_connect("<database host>","<database username>","<database password>");

$URLforMediaServer = "http://<your site>/<your media directory>";

//mysql_connect(servername,username,password); 
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
 
mysql_select_db("<database name>", $con);


if ($limitSearchToApp)
{
$query = "SELECT * FROM media WHERE appName='$appName'";
}
else
{
$query = "SELECT * FROM media";
}


$result = mysql_query($query);



// NOTE: Next line is crucial...without won't work between diff domains!
header('Access-Control-Allow-Origin: *');

// Available fields:
// mediaFilename | likeCount | dateCreated | textLabel | location | appName | mediaType | personName |

echo "<table border='1'><tr><th>URL</th><th>Image</th><th>Likes</th><th>Date Added to Media Store</th><th>Location</th><th>Application/Experience</th><th>File type</th><th>Person</th><th>Admin options</th></tr>";

while($row = mysql_fetch_array($result))
  {
  
    if (empty($row)) {
    echo "empty";
} else {
  
  echo "<tr>";
  
  echo "<td>" ."<a href=\"".$URLforMediaServer.$row['mediaFilename']."\" target=\"_blank\">".$row['mediaFilename'] ."</a>"."</td>";

  echo "<td>" ."<a href=\"".$URLforMediaServer.$row['mediaFilename']."\" target=\"_blank\"><img src=\"".$URLforMediaServer.$row['mediaFilename'] . "\" width=\"200\" height=\"200\">"."</a>"."</td>";
  
//    echo "<td>" ."<a href=\""$URLforMediaServer.$row['mediaFilename'] ." target=\"_blank\"><img src=\""$URLforMediaServer.$row['mediaFilename'] . "\" width=\"200\" height=\"200\">"."</a>"."</td>";
 

 
  echo "<td>" . $row['likeCount'] .  "</td>";
  echo "<td>" . $row['dateCreated'] . "</td>";
  echo "<td>" . $row['location'] . "</td>";
  echo "<td>" . $row['appName'] . "</td>";
  echo "<td>" . $row['mediaType'] . "</td>";
  echo "<td>" . $row['personName'] . "</td>";
  
//  echo "<td>" ."<a href=\"".$URLforMediaServer.$row['mediaFilename']."\" target=\"_blank\">Delete</a>"."</td>";
    
 //  echo "<td>"."<a href=\"javascript:void(0);\" onclick=\"deleteMedia(\"".$row['mediaFilename']."\");\">Delete</a>"."<td>";
   
       
   echo "<td>"."<a href=\"javascript:void(0);\" onclick=\"deleteMedia('".$row['mediaFilename']."');\">Delete from DB and store</a>"."<td>";
  

  
  echo "</tr>";
  }
}
  
echo "</table>";

mysql_close($con);
?> 

