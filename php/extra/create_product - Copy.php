<?php

/*
 * Following code will create a new sign complaint row
 * All sign comp details are read from HTTP Post Request
 */

// array for JSON response
$response = array();

// check for required fields
if (isset($_POST['userid']) && isset($_POST['department']) && isset($_POST['hostel']) && isset($_POST['room']) && isset($_POST['description']) && isset($_POST['status']) && isset($_POST['subject'])) {
    
    $userid = $_POST['userid'];
    $department = $_POST['department'];
    $hostel = $_POST['hostel'];
	$room = $_POST['room'];
	$description = $_POST['description'];
	$status = $_POST['status'];
	$subject = $_POST['subject'];

    // include db connect class
    require_once __DIR__ . '/db_connect.php';

    // connecting to db
    $db = new DB_CONNECT();

    // mysql inserting a new row
    $result = mysql_query("INSERT INTO signed_complaints (userid, subject, room, hostel, department, description, status) VALUES ('$userid', '$subject', '$room', '$hostel', '$department', '$description', '$status')");

    // check if row inserted or not
    if ($result) {
        // successfully inserted into database
        $response["success"] = 1;
        $response["message"] = "Signed complaint successfully created.";

        // echoing JSON response
        echo json_encode($response);
    } else {
        // failed to insert row
        $response["success"] = 0;
        $response["message"] = "Oops! An error occurred.";
        
        // echoing JSON response
        echo json_encode($response);
    }
} else {
    // required field is missing
    $response["success"] = 0;
    $response["message"] = "Required field(s) is missing";

    // echoing JSON response
    echo json_encode($response);
}
?>