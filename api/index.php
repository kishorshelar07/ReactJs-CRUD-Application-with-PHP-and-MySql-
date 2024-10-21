<?php
include 'db_connect.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Handle preflight requests (for non-simple requests)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Get the input data
$data = json_decode(file_get_contents("php://input"));

// Initialize the response array
$resp_data = ["message" => "No data received", "data" => null];

// Check the request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle POST (Insert), PUT (Update), DELETE (Delete) based on request method
if ($data) {
    $name = isset($data->name) ? $data->name : null;
    $email = isset($data->email) ? $data->email : null;
    $age = isset($data->age) ? $data->age : null;
    $id = isset($data->id) ? $data->id : null; // Used for update and delete

    if ($method === 'POST') {
        // Insert user into the database
        $sql = "INSERT INTO USER (usr_name, usr_email, usr_age) VALUES ('$name', '$email', '$age')";
        if ($conn->query($sql) === TRUE) {
            $resp_data = [
                "message" => "User added successfully...",
                "data" => [
                    "name" => $name,
                    "email" => $email,
                    "age" => $age
                ]
            ];
        } else {
            $resp_data = ["message" => "Error inserting data", "data" => null];
        }
    } elseif ($method === 'PUT' && $id) {
        // Update user in the database
        $sql = "UPDATE USER SET usr_name='$name', usr_email='$email', usr_age='$age' WHERE usr_id=$id";
        if ($conn->query($sql) === TRUE) {
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
            $resp_data = ["message" => "Error updating data", "data" => null];
        }
    } elseif ($method === 'DELETE' && $id) {
        // Delete user from the database
        $sql = "DELETE FROM USER WHERE usr_id=$id";
        if ($conn->query($sql) === TRUE) {
            $resp_data = ["message" => "User deleted successfully..."];
        } else {
            $resp_data = ["message" => "Error deleting data", "data" => null];
        }
    } else {
        $resp_data = ["message" => "Invalid request", "data" => null];
    }
}

echo json_encode($resp_data);
?>
