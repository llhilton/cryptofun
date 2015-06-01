<?php
//get the variable from the AJAX request eventually
error_reporting(-1);
$puzzletoget=rand(1,602);

$user="username";
$password="password";
$database="database";
$host="host";
mysql_connect($host,$user,$password);
@mysql_select_db($database) or die("Unable to select database");

$query = "SELECT * FROM aaquotes WHERE qnumber = " . $puzzletoget;

$tosendback=mysql_query($query);

mysql_close();

$results["quotation"]=mysql_result($tosendback,0,"quotation");
$results["author"]=mysql_result($tosendback,0,"qauthor");

echo json_encode($results);
?>