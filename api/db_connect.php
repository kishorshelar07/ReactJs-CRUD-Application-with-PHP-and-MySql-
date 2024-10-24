<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "dbuser";


// creat connection
$conn = new mysqli($servername, $username, $password, $dbname);


// Check Connection 
if ($conn->connect_error) {
    die("connection faild:" . $conn->connect_error);
} else {
    echo "";
}

?>