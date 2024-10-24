import React, { useState, useEffect } from "react"; // Import necessary React hooks (useState, useEffect)
import axios from "axios"; // Import axios for making HTTP requests
import "./form.css"; // Import CSS styles for the form

function UserForm() {
  // useState hook for managing form data and user list
  const [form_data, set_form_data] = useState({
    name: "",
    email: "",
    age: "",
    usr_no: null, // This is used to track if the user is being edited (null means new user)
  });

  const [users, setUsers] = useState([]); // State to hold fetched users
  const [searchInput, setSearchInput] = useState(""); // State for search input

  // useEffect hook to fetch users from the server (with optional search query)
  useEffect(() => {
    // If searchInput exists, append it as a query parameter
    const searchQuery = searchInput ? `?search=${searchInput}` : "";
    const url = `http://localhost/server4react/index.php${searchQuery}`; // URL for fetching users

    // Fetch users from the server using axios
    axios
      .get(url)
      .then((response) => {
        const jsonResponse = response.data;
        console.log("Fetched User Data:", jsonResponse); // Log fetched user data

        if (jsonResponse && jsonResponse.data) {
          setUsers(jsonResponse.data); // Set the users state with fetched data
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error); // Handle any errors during the fetch
      });
  }, [searchInput]); // This effect runs again when the searchInput changes

  // Handle search input change
  const handleSearch = (e) => {
    setSearchInput(e.target.value); // Update searchInput state on change
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the input
    set_form_data((form_data) => ({
      ...form_data, // Keep the previous form data
      [name]: value, // Update the specific field being changed
    }));
  };

  // Handle form submission (Create/Update user)
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission

    const requestMethod = form_data.usr_no ? "PUT" : "POST"; // Decide if it's a create (POST) or update (PUT)

    // Send form data to the server via axios
    axios({
      method: requestMethod,
      url: "http://localhost/server4react/index.php", // URL for submitting form data
      data: form_data, // Send the form data in the request
    })
      .then((response) => {
        const resp_data = JSON.parse(JSON.stringify(response.data)).data; // Parse response

        if (resp_data) {
          if (requestMethod === "POST") {
            // If it's a new user (POST), add the new user to the users array
            setUsers((users) => [...users, resp_data]);
          } else if (requestMethod === "PUT") {
            // If it's an update (PUT), update the existing user in the array
            setUsers((users) =>
              users.map((u) => (u.usr_no === form_data.usr_no ? resp_data : u))
            );
          }

          // Reset the form data after submission
          set_form_data({
            name: "",
            email: "",
            age: "",
            usr_no: null, // Reset usr_no to null after the user is created/updated
          });
        }
      })
      .catch((error) => {
        console.error("Error submitting the form:", error); // Handle submission error
      });
  };

  // Handle update button click (pre-fill the form with user data)
  const handleUpdate = (user) => {
    set_form_data({
      name: user.usr_name, // Set the form fields with user data to be updated
      email: user.usr_email,
      age: user.usr_age,
      usr_no: user.usr_no, // usr_no is required to identify the user being updated
    });
  };

  // Handle delete button click (delete user)
  const handleDelete = (user) => {
    // Show a confirmation dialog before deleting
    if (window.confirm(`Are you sure you want to delete the user: ${user.name}?`)) {
      axios
        .delete(`http://localhost/server4react/index.php?usr_no=${user.usr_no}`) // Send delete request with user ID
        .then(() => {
          setUsers((prevUsers) => prevUsers.filter((u) => u.usr_no !== user.usr_no)); // Remove the deleted user from the list
          console.log("User Deleted:", user); // Log deletion
        })
        .catch((error) => {
          console.error("Error deleting user:", error); // Handle deletion error
        });
    }
  };

  return (
    <div>
      {/* User form */}
      <form onSubmit={handleSubmit}>
        <h2>User Form</h2>
        <div>
          <label>Name:</label>
          <input type="text"  name="name" value={form_data.name}  onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input  type="email" name="email" value={form_data.email}  onChange={handleChange} required />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" name="age" value={form_data.age} onChange={handleChange} required />
        </div>
        <button type="submit">{form_data.usr_no ? "Update" : "Submit"}</button> {/* Change button text based on form mode */}
      </form>

      {/* Display submitted users in a table */}
      <h3>Submitted Users:</h3>
      
      {/* Search input for searching users */}
      <div className="search">
 
        <input type="text" placeholder="Search by name or email" value={searchInput} onChange={handleSearch} />
      </div><hr/>

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
            {/* Iterate through users array and display each user */}
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.usr_no}</td> 
                <td>{user.usr_name}</td> 
                <td>{user.usr_email}</td> 
                <td>{user.usr_age}</td> 
                <td>
                  {/* Update button (calls handleUpdate to pre-fill the form) */}
                  <button onClick={() => handleUpdate(user)}><i className="bi bi-pencil-square"></i></button>
                  {/* Delete button (calls handleDelete to remove user) */}
                  <button onClick={() => handleDelete(user)}><i className="bi bi-trash3-fill"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p> 
      )}
    </div>
  );
}

export default UserForm;
