// Import necessary dependencies from React and Axios
import React, { useState } from "react"; // useState for managing component state
import axios from "axios"; // Axios for making HTTP requests
import UserGrid from "./UserGrid"; // Import UserGrid component to display users
import './form.css'; // Import CSS for form styling

// Define the main component called UserForm
function UserForm() {
  
  // State to manage form input data (name, email, age), initialized with empty values
  const [form_data, setFormData] = useState({
    name: "", // Name input field value
    email: "", // Email input field value
    age: "", // Age input field value
  });

  // State to store an array of user objects
  const [users, setUsers] = useState([]); // Initially, the users array is empty

  // Function to handle input changes and update the form_data state
  const handleChange = (e) => {
    // Destructure name and value from the event target (input field)
    const { name, value } = e.target;

    // Update the form_data state with the new value for the specific input field
    setFormData((form_data) => ({
      ...form_data, // Spread the previous form data (retain other values)
      [name]: value, // Update the field that matches the input name (name, email, or age)
    }));
  };

  // Function to handle form submission when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)

    // Log to the console for debugging that the form was submitted
    console.log("Form submitted!");

    // Make a POST request to the server using Axios, sending the form data
    axios.post("http://localhost/server4react/index.php", form_data)
      .then((response) => {
        // Log the full response from the server for debugging purposes
        console.log("Full Response from server:", response);

        // Extract the JSON response string from the server response
        const jsonResponse = response.data;

        // Find the starting index of the JSON data (in case of extra content in response)
        const jsonStart = jsonResponse.indexOf('{');

        // Extract the actual JSON string from the response
        const jsonString = jsonResponse.substring(jsonStart);

        // Log the extracted JSON string for debugging
        console.log("json string:", jsonString);

        try {
          // Parse the JSON string into a JavaScript object
          const resp_data = JSON.parse(jsonString);

          // Log the parsed response data for debugging
          console.log("Parsed Response Data:", resp_data);

          // Check if the response contains valid user data
          if (resp_data && resp_data.data) {
            // Add the new user to the users array by spreading the existing users
            setUsers((users) => [...users, resp_data.data]);
          } else {
            // Log an error if the server returned invalid or unexpected data
            console.error("Invalid data received from server:", resp_data);
          }

          // Reset the form data to empty after successful submission
          setFormData({
            name: "", 
            email: "", 
            age: "", 
          });
        } catch (error) {
          // Catch and log any errors that occur during JSON parsing
          console.error("Error parsing JSON response:", error);
        }
      })
      .catch((error) => {
        // Catch and log any errors that occur during the HTTP request
        console.error("There was an error submitting the form!", error);
      });
  };

  // Render the form and the user grid component
  return (
    <div>
      {/* Heading for the form */}
      <h2>User Form</h2>
      
      {/* Form element with onSubmit handler */}
      <form onSubmit={handleSubmit}>
        
        {/* Name input field */}
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

        {/* Email input field */}
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

        {/* Age input field */}
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

        {/* Submit button */}
        <button type="submit">Submit</button>
      </form>

      {/* Display the list of users using the UserGrid component */}
      <UserGrid users={users} /> {/* Pass the users array as a prop to the UserGrid component */}
    </div>
  );
}

// Export the UserForm component as the default export
export default UserForm;
