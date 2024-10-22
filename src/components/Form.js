// Import necessary dependencies from React and Axios
import React, { useState } from "react";  // Importing React and useState for state management
import axios from "axios";                // Importing Axios for making HTTP requests
import "./form.css";                      // Import form styling
import UserGrid from "./UserGrid";         // Import the separated UserGrid component

// Main functional component for UserForm
function UserForm() {
  // useState hook to manage form data, initializing with empty values
  const [form_data, setFormData] = useState({
    name: "",    
    email: "",   
    age: "",     
    usr_no: null,
  });

  // useState hook to store the list of users
  const [users, setUsers] = useState([]);

  // Function to handle changes in the form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;  // Destructuring name and value from event target
    setFormData((form_data) => ({
      ...form_data,         // Spread the current form data to preserve existing fields
      [name]: value,        // Update the specific field with the new value
    }));

   
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent the default form submission behavior
    const requestMethod = form_data.usr_no ? "PUT" : "POST";  // If usr_no exists, it's an update (PUT); otherwise, it's a new entry (POST)

    // Make an Axios request to the backend
    axios({
      method: requestMethod,  // Dynamic request method (POST for new, PUT for update)
      url: "http://localhost/server4react/index.php",  // Backend URL
      data: form_data,  // Data being sent in the request (user form data)
    })
      .then((response) => {
        // Log the full response from the server
        console.log(" From Server Response:", response);

        // Extract and log the JSON response
        const jsonResponse = response.data;
        console.log("JSON Response:", jsonResponse);

        // Extract and parse the JSON data
        const jsonStart = jsonResponse.indexOf("{");
        const jsonString = jsonResponse.substring(jsonStart);
        try {
          const resp_data = JSON.parse(jsonString);
          console.log("Parsed Response Data:", resp_data);  // Log parsed response

          // If the response contains valid data
          if (resp_data && resp_data.data) {
            if (requestMethod === "POST") {
              // For POST requests, add the new user to the users array
              setUsers((users) => [...users, resp_data.data]);
            } else if (requestMethod === "PUT") {
              // For PUT requests, update the existing user in the users array
              setUsers((users) =>
                users.map((u) =>
                  u.usr_no === form_data.usr_no ? resp_data.data : u
                )
              );
            }
            // Reset the form data after submission
            setFormData({
              name: "",
              email: "",
              age: "",
              usr_no: null,
            });
          }
        } catch (error) {
          console.error("Error parsing JSON response:", error);  // Log any JSON parsing errors
        }
      })
      .catch((error) => {
        console.error("Error submitting the form:", error);  // Handle any errors in the request
      });
  };

  // Function to handle updating a user's data
  const handleUpdate = (user) => {
    // Populate the form with the user's data for editing
    setFormData({
      name: user.name,    
      email: user.email,  
      age: user.age,      
      usr_no: user.usr_no, 
    });

   
  };

  // Function to handle deleting a user
  const handleDelete = (user) => {
    // Ask for confirmation before deleting the user
    if (window.confirm(`Are you sure you want to delete the user: ${user.name}?`)) {
      axios
        .delete(`http://localhost/server4react/index.php?usr_no=${user.usr_no}`)  // Send DELETE request to server with user's usr_no
        .then(() => {
          // Remove the user from the users array after successful deletion
          setUsers((prevUsers) =>
            prevUsers.filter((u) => u.usr_no !== user.usr_no)
          );
          console.log("User Deleted:", user);
        })
        .catch((error) => {
          console.error("Error deleting user:", error);  // Handle any errors during deletion
        });
    }
  };

  return (
    <div>
      {/* Form for capturing user input */}
      <form onSubmit={handleSubmit}>
        <h2>User Form</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={form_data.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form_data.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={form_data.age}
            onChange={handleChange}
            required
          />
        </div>
        {/* Toggle button text between "Submit" and "Update" based on usr_no */}
        <button type="submit">{form_data.usr_no ? "Update" : "Submit"}</button>
      </form>

      {/* Render the UserGrid component, passing users, handleUpdate, and handleDelete as props */}
      <UserGrid users={users} handleUpdate={handleUpdate} handleDelete={handleDelete} />
    </div>
  );
}

export default UserForm; // Export UserForm component
