// Import necessary dependencies from React and Axios
import React, { useState, useEffect } from "react"; // Importing React and useState for state management
import axios from "axios"; // Importing Axios for making HTTP requests
import "./form.css"; // Import form styling

// Main functional component for UserForm
function UserForm() {
  // useState hook to manage form data, initializing with empty values
  const [form_data, set_form_data] = useState({
    name: "",
    email: "",
    age: "",
    usr_no: null,
  });

  // useState hook to store the list of users
  const [users, setUsers] = useState([]);

  // Fetch users when the component loads
  useEffect(() => {
    // Make a GET request to fetch user data
    axios
      .get("http://localhost/server4react/index.php") // Replace this with your actual backend URL
      .then((response) => {
        const jsonResponse = response.data;
        console.log("Fetched User Data:", jsonResponse);

        // Check if the response data contains the user list
        if (jsonResponse && jsonResponse.data) {
          setUsers(jsonResponse.data); // Set the fetched users to the users state
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error); // Handle any errors while fetching the data
      });
  }, []); // Empty dependency array to ensure this runs once when the component mounts

  // Function to handle changes in the form inputs
  const handleChange = (e) => {
    const { name, value } = e.target; // Destructuring name and value from event target
    set_form_data((form_data) => ({
      ...form_data, // Spread the current form data to preserve existing fields
      [name]: value, // Update the specific field with the new value
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const requestMethod = form_data.usr_no ? "PUT" : "POST"; // Determine if it's a PUT or POST request

    // Make an Axios request to the backend
    axios({
      method: requestMethod, // Dynamic request method (POST for new, PUT for update)
      url: "http://localhost/server4react/index.php", // Backend URL
      data: form_data, // Data being sent in the request (user form data)
    })
      .then((response) => {
        console.log("From Server Response:", response);

        // Use JSON.stringify on the response.data to convert it to a JSON string
        const jsonStringResponse = JSON.stringify(response.data);
        console.log("Stringified Response Data:", jsonStringResponse);

        // Parse the stringified JSON back to an object
        const resp_data = JSON.parse(jsonStringResponse).data;

        console.log("Parsed Response Data:", resp_data);

        // Check if resp_data exists and is valid
        if (resp_data) {
          if (requestMethod === "POST") {
            setUsers((users) => [...users, resp_data]); // Add new user
          } else if (requestMethod === "PUT") {
            setUsers((users) =>
              users.map((u) => (u.usr_no === form_data.usr_no ? resp_data : u))
            ); // Update existing user
          }

          // Reset the form data after submission
          set_form_data({
            name: "",
            email: "",
            age: "",
            usr_no: null,
          });
        }
      })
      .catch((error) => {
        console.error("Error submitting the form:", error); // Handle any errors in the request
      });
  };

  // Function to handle updating a user's data
  const handleUpdate = (user) => {
    set_form_data({
      name: user.usr_name,
      email: user.usr_email,
      age: user.usr_age,
      usr_no: user.usr_no,
    });
  };

  // Function to handle deleting a user
  const handleDelete = (user) => {
    if (
      window.confirm(`Are you sure you want to delete the user: ${user.name}?`)
    ) {
      axios
        .delete(`http://localhost/server4react/index.php?usr_no=${user.usr_no}`) // Send DELETE request to server
        .then(() => {
          setUsers((prevUsers) =>
            prevUsers.filter((u) => u.usr_no !== user.usr_no)
          ); // Remove user after successful deletion
          console.log("User Deleted:", user);
        })
        .catch((error) => {
          console.error("Error deleting user:", error); // Handle errors during deletion
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
        <button type="submit">{form_data.usr_no ? "Update" : "Submit"}</button>
      </form>

      {/* Display the list of users directly */}
      <h3>Submitted Users:</h3>
      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.usr_no}</td>
                <td>{user.usr_name}</td>
                <td>{user.usr_email}</td>
                <td>{user.usr_age}</td>
                <td>
                  <button onClick={() => handleUpdate(user)}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button onClick={() => handleDelete(user)}>
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users submitted yet.</p>
      )}
    </div>
  );
}

export default UserForm;
