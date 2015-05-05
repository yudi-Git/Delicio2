<?php

/*
 * Following code will get logn details
 */

// array for JSON response
$response = array();


// include db connect class
require_once __DIR__ . '/db_connect.php';

// connecting to db
$db = new DB_CONNECT();

// check for post data
if (isset($_GET["username"])) {
    $uname = $_GET['username'];

    // get a product from products table
    $result = mysql_query("SELECT *FROM test_login WHERE username = $uname");

    if (!empty($result)) {
        // check for empty result
        if (mysql_num_rows($result) > 0) {

            $result = mysql_fetch_array($result);

            $loginDetails = array();
            $loginDetails["username"] = $result["username"];
            $loginDetails["password"] = $result["password"];
            $loginDetails["usertype"] = $result["usertype"];
            // success
            $response["success"] = 1;

            // user node
            $response["loginDetails"] = array();

            array_push($response["loginDetails"], $loginDetails);

            // echoing JSON response
            echo json_encode($response);
        } else {
            // no user found
            $response["success"] = 0;
            $response["message"] = "User not found";

            // echo no users JSON
            echo json_encode($response);
        }
    } else {
        // no user found
        $response["success"] = 0;
        $response["message"] = "No user found";

        // echo no users JSON
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