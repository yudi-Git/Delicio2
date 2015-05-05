<?php

/*
 * Following code will create a new sign complaint row
 * All sign comp details are read from HTTP Post Request
 */

// array for JSON response
$response = array();
// check for required fields
if (isset($_POST['userid']) && isset($_POST['description']) && isset($_POST['designation']) && isset($_POST['subject'])){
    
    $userid = $_POST['userid'];
    $description = $_POST['description'];
	$subject = $_POST['subject'];
	$designation = $_POST['designation'];

    // include db connect class
    require_once __DIR__ . '/db_connect.php';

    // connecting to db
    $db = new DB_CONNECT();

    // mysql inserting a new row
    $result = mysql_query("INSERT INTO notices (userid, title, description, designation) VALUES ('$userid', '$subject', '$description', '$designation')");

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