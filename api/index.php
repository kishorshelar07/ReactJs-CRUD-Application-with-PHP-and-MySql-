<?php
include 'db_connect.php'; // Including database connection





// Set headers for cross-origin requests and content type
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Handle OPTIONS request for preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // Send no content response for OPTIONS
    exit();
}

// Initialize default response data
$resp_data = ["message" => "No data received", "data" => null];

// Get the HTTP request method (POST, PUT, DELETE, etc.)
$method = $_SERVER['REQUEST_METHOD'];

// Handle GET request (fetch users)
if ($method === 'GET') {
    $sql = "SELECT usr_no, usr_name, usr_email, usr_age FROM USER";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }

        echo json_encode([
            "message" => "Users fetched successfully...",
            "data" => $users
        ]);
    } else {
        echo json_encode(["message" => "No users found", "data" => null]);
    }
    exit(); // Exit after handling GET request to prevent further code execution
}

// Decode the incoming JSON data if applicable (for POST and PUT requests)
$data = json_decode(file_get_contents("php://input"));

if ($data) {
    // Get the data from the request if available
    $name = isset($data->name) ? $data->name : null;
    $email = isset($data->email) ? $data->email : null;
    $age = isset($data->age) ? $data->age : null;
    $usr_no = isset($data->usr_no) ? $data->usr_no : null;

    // Handle POST request (for creating a new user)
    if ($method === 'POST') {
        $sql = "INSERT INTO USER (usr_name, usr_email, usr_age) VALUES ('$name', '$email', '$age')";

        if ($conn->query($sql) === TRUE) {
            $resp_data = [
                "message" => "User added successfully...",
                "data" => [
                    "usr_no" => $conn->insert_id, // Get the inserted user ID
                    "name" => $name,
                    "email" => $email,
                    "age" => $age
                ]
            ];
        } else {
            $resp_data = ["message" => "Error inserting data", "data" => null];
        }

    // Handle PUT request (for updating an existing user)
    } elseif ($method === 'PUT' && $usr_no) {
        $sql = "UPDATE USER SET usr_name='$name', usr_email='$email', usr_age='$age' WHERE usr_no=$usr_no";

        if ($conn->query($sql) === TRUE) {
            $resp_data = [
                "message" => "User updated successfully...",
                "data" => [
                    "usr_no" => $usr_no,
                    "name" => $name,
                    "email" => $email,
                    "age" => $age
                ]
            ];
        } else {
            $resp_data = ["message" => "Error updating data", "data" => null];
        }
    } else {
        $resp_data = ["message" => "Invalid request", "data" => null]; // Invalid method or missing user ID
    }
} elseif ($method === 'DELETE') {
    // Get usr_no from the query string (since it's passed as a URL parameter)
    $usr_no = isset($_GET['usr_no']) ? intval($_GET['usr_no']) : null;

    if ($usr_no) {
        // Execute the DELETE querycd user
        $sql = "DELETE FROM USER WHERE usr_no = $usr_no";
        if ($conn->query($sql) === TRUE) {
            $resp_data = ["message" => "User deleted successfully"];
        } else {
            $resp_data = ["message" => "Error deleting user", "data" => null];
        }
    } else {
        $resp_data = ["message" => "User ID not provided", "data" => null];
    }
} else {
    $resp_data = ["message" => "Unsupported request method", "data" => null];
}

// Return the response as a JSON object
echo json_encode($resp_data);
