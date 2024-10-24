<?php
include 'db_connect.php'; // Including the database connection script

// Set headers for cross-origin requests and content type to allow cross-domain requests
header('Access-Control-Allow-Origin: *'); // Allow all origins for CORS
header('Content-Type: application/json; charset=UTF-8'); // Set response content type to JSON
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS'); // Specify allowed HTTP methods
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Handle OPTIONS requests, typically used for CORS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // Respond with 204 No Content for OPTIONS
    exit(); // Exit the script after handling preflight request
}

// Initialize response data with a default message
$resp_data = ["message" => "No data received", "data" => null];

// Determine the request method (GET, POST, PUT, DELETE, etc.)
$method = $_SERVER['REQUEST_METHOD'];

// Handle GET requests for fetching user data (with or without search queries)
if ($method === 'GET') {
    // Check if a search query parameter is present
    $searchQuery = isset($_GET['search']) ? $_GET['search'] : '';

    // Build the SQL query based on the presence of a search query
    if ($searchQuery) {
        // Fetch users matching the search term in the name, email, or age fields
        $sql = "SELECT usr_no, usr_name, usr_email, usr_age 
                FROM USER 
                WHERE usr_name LIKE '%$searchQuery%' 
                OR usr_email LIKE '%$searchQuery%' 
                OR usr_age LIKE '%$searchQuery%'";
    } else {
        // If no search query, fetch all users from the database
        $sql = "SELECT usr_no, usr_name, usr_email, usr_age FROM USER";
    }

    // Execute the SQL query and store the result
    $result = $conn->query($sql);

    // If there are results, fetch them and send them in the response
    if ($result->num_rows > 0) {
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row; // Collect each user into the users array
        }

        // Send a successful response with the fetched user data
        echo json_encode([
            "message" => "Users fetched successfully...",
            "data" => $users
        ]);
    } else {
        // If no users are found, send a response indicating that
        echo json_encode(["message" => "No users found", "data" => null]);
    }
    exit(); // Exit the script after processing the GET request
}

// Decode JSON data from incoming requests (applicable for POST and PUT requests)
$data = json_decode(file_get_contents("php://input"));

// If there's valid data in the request, extract fields for name, email, age, and usr_no
if ($data) {
    $name = isset($data->name) ? $data->name : null;
    $email = isset($data->email) ? $data->email : null;
    $age = isset($data->age) ? $data->age : null;
    $usr_no = isset($data->usr_no) ? $data->usr_no : null;

    // Handle POST request to create a new user
    if ($method === 'POST') {
        // SQL query to insert a new user into the USER table
        $sql = "INSERT INTO USER (usr_name, usr_email, usr_age) VALUES ('$name', '$email', '$age')";

        // If the query is successful, respond with the new user data
        if ($conn->query($sql) === TRUE) {
            $resp_data = [
                "message" => "User added successfully...",
                "data" => [
                    "usr_no" => $conn->insert_id, // Get the auto-generated user ID
                    "name" => $name,
                    "email" => $email,
                    "age" => $age
                ]
            ];
        } else {
            // Respond with an error if the query fails
            $resp_data = ["message" => "Error inserting data", "data" => null];
        }

    // Handle PUT request to update an existing user
    } elseif ($method === 'PUT' && $usr_no) {
        // SQL query to update user data based on the provided usr_no
        $sql = "UPDATE USER SET usr_name='$name', usr_email='$email', usr_age='$age' WHERE usr_no=$usr_no";

        // If the query is successful, respond with the updated user data
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
            // Respond with an error if the update query fails
            $resp_data = ["message" => "Error updating data", "data" => null];
        }
    } else {
        // If the request method or data is invalid, respond with an error
        $resp_data = ["message" => "Invalid request", "data" => null];
    }
} elseif ($method === 'DELETE') {
    // Handle DELETE requests to remove a user by usr_no from the query string
    $usr_no = isset($_GET['usr_no']) ? intval($_GET['usr_no']) : null;

    // If a valid user ID is provided, attempt to delete the user
    if ($usr_no) {
        $sql = "DELETE FROM USER WHERE usr_no = $usr_no";

        // If the deletion is successful, send a success message
        if ($conn->query($sql) === TRUE) {
            $resp_data = ["message" => "User deleted successfully"];
        } else {
            // Respond with an error if the deletion fails
            $resp_data = ["message" => "Error deleting user", "data" => null];
        }
    } else {
        // Respond with an error if no user ID is provided
        $resp_data = ["message" => "User ID not provided", "data" => null];
    }
} else {
    // If the request method is not supported, send an error response
    $resp_data = ["message" => "Unsupported request method", "data" => null];
}

// Send the final response as a JSON object
echo json_encode($resp_data);
?>
