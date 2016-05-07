<?php

$appName=$_GET["appName"];
$tag=$_GET["tag"];
$location=$_GET["location"];
$likeCount=$_GET["likeCount"];
$startDateCreatedPeriod=$_GET["startDateCreatedPeriod"];
$endDateCreatedPeriod=$_GET["endDateCreatedPeriod"];
$personName=$_GET["personName"];
$mediaType=$_GET["mediaType"];

$con = mysql_connect("<database host>","<database username>","<database password>");

if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
 
mysql_select_db("<database name>", $con);

// TO DO: construct the WHERE bit of the SQL statement, depending on which variables are assigned and which are NULL.

// media table:
// mediaFilename | likeCount | dateCreated | textLabel | location | appName | mediaType | personName |

// tage table:
// | mediaFilename | tag  | appName | categoryLabel |

if(!empty($appName))
	{

// There is an appName specified
	
		if (!empty($tag))
		// There is an appName AND a tag specified
			{
			$result = mysql_query("SELECT mediaFilename FROM tags WHERE appName='$appName' and tag='$tag';");
			}
		else
		// There is an appName but not a tag specified
			{
			$result = mysql_query("SELECT mediaFilename FROM media WHERE appName='$appName';");
			}
	}
else
	{
// There is NOT an appName specified	

		if (!empty($tag))
		// There is just a tag specified...so look in the tags table...not the media table
			{
			debug("tag is not empty");		
			$result = mysql_query("SELECT mediaFilename FROM tags WHERE tag='$tag';");
			}
		else
		// Nothing is specified and I want all media items...
			{
			$result = mysql_query("SELECT mediaFilename FROM media;");
			}

	}



// NOTE: Next line is crucial...without won't work between diff domains!
header('Access-Control-Allow-Origin: *');

// How many rows are there in the result?
$num_rows = mysql_num_rows($result);

// Set a variable to track whether this is the last row...
$i = 1; 

while($row = mysql_fetch_array($result))
  {
  
  if (empty($row)) 
	{
	 echo "empty";
    } 
  else 
   {
   // We always want the contents of the next row...
   echo $row['mediaFilename'];
   if ($i!==$num_rows)
   // ...as long as this isn't the last row...we want an comma after it 
   // to use as a separator to pass the string in JavaScript
   {
    echo ",";
    }
	
	}
// increment row counter to check for last row...
$i++;
  }
  
  
mysql_close($con);

function debug($data) {
$file = 'debug.out';
file_put_contents($file, $data);
}


?> 

