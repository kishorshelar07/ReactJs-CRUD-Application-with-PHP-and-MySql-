<?php
// Include the database connection file
include 'db_connect.php';

// Set response headers for CORS (Cross-Origin Resource Sharing) and content type
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin
header('Content-Type: application/json; charset=UTF-8'); // Set response content type to JSON
header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS'); // Allow specific HTTP methods
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'); // Set allowed headers

// Handle preflight requests (OPTIONS method used by browsers for non-simple requests)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // Send a 204 No Content response
    exit(); // Exit the script since preflight requests don't need further processing
}

// Get the input data from the request body, typically sent as JSON
$data = json_decode(file_get_contents("php://input"));

// Initialize a response array with default values
$resp_data = ["message" => "No data received", "data" => null];

// Get the request method (POST, PUT, DELETE, etc.)
$method = $_SERVER['REQUEST_METHOD'];

// Check if input data exists
if ($data) {
    // Extract values from the input data (name, email, age, and id for updates)
    $name = isset($data->name) ? $data->name : null; // Name value, if provided
    $email = isset($data->email) ? $data->email : null; // Email value, if provided
    $age = isset($data->age) ? $data->age : null; // Age value, if provided
    $id = isset($data->id) ? $data->id : null; // ID value (only used for update and delete)

    // Handle different HTTP methods (POST, PUT, DELETE)
    if ($method === 'POST') {
        // If the method is POST, insert a new user into the database
        $sql = "INSERT INTO USER (usr_name, usr_email, usr_age) VALUES ('$name', '$email', '$age')";
        
        // Check if the query execution was successful
        if ($conn->query($sql) === TRUE) {
            // If insertion is successful, prepare a success response
            $resp_data = [
                "message" => "User added successfully...",
                "data" => [
                    "name" => $name,
                    "email" => $email,
                    "age" => $age
                ]
            ];
        } else {
            // If there was an error inserting the data, prepare an error response
            $resp_data = ["message" => "Error inserting data", "data" => null];
        }
    } elseif ($method === 'PUT' && $id) {
        // If the method is PUT, update an existing user in the database using their ID
        $sql = "UPDATE USER SET usr_name='$name', usr_email='$email', usr_age='$age' WHERE usr_id=$id";
        
        // Check if the update query execution was successful
        if ($conn->query($sql) === TRUE) {
            // If update is successful, prepare a success response
            $resp_data = [
                "message" => "User updated successfully...",
                "data" => [
                    "id" => $id,
                    "name" => $name,
                    "email" => $email,
                    "age" => $age
                ]
            ];
        } else {
            // If there was an error updating the data, prepare an error response
            $resp_data = ["message" => "Error updating data", "data" => null];
        }
    } elseif ($method === 'DELETE' && $id) {
        // If the method is DELETE, remove a user from the database using their ID
        $sql = "DELETE FROM USER WHERE usr_id=$id";
        
        // Check if the delete query execution was successful
        if ($conn->query($sql) === TRUE) {
            // If deletion is successful, prepare a success response
            $resp_data = ["message" => "User deleted successfully..."];
        } else {
            // If there was an error deleting the data, prepare an error response
            $resp_data = ["message" => "Error deleting data", "data" => null];
        }
    } else {
        // If the request method is invalid or missing required data, prepare an error response
        $resp_data = ["message" => "Invalid request", "data" => null];
    }
}

// Encode the response array as a JSON string and send it back to the client
echo json_encode($resp_data);
?>
