import React, { useState, useEffect } from "react";
import axios from "axios";
import "./form.css";

function UserForm() {
  // Initialize state for form data, users list, search input, and editing mode
  const [form_data, set_form_data] = useState({
    name: "",       // Stores the user's name
    email: "",      // Stores the user's email
    age: "",        // Stores the user's age
    usr_no: null,   // Tracks user ID for editing; null for new entries
  });

  const [users, setUsers] = useState([]);              // Stores the list of all users
  const [searchInput, setSearchInput] = useState("");   // Stores the search input text
  const [isEditing, setIsEditing] = useState(false);    // Tracks if the form is in "Edit" mode

  // Fetches users whenever searchInput changes (i.e., whenever user searches)
  useEffect(() => {
    const searchQuery = searchInput ? `?search=${searchInput}` : "";  // Adds search query if there's input
    const url = `http://localhost/server4react/index.php${searchQuery}`;  // Construct URL with query

    // Send GET request to fetch user data
    axios
      .get(url)
      .then((response) => {
        const jsonResponse = response.data;             // Parse response data
        console.log("Fetched User Data:", jsonResponse);

        if (jsonResponse && jsonResponse.data) {        // If data exists, update users state
          setUsers(jsonResponse.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);   // Log any errors during fetch
      });
  }, [searchInput]);  // Dependency array with searchInput, re-runs on change

  // Update search input state as user types in search box
  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle input change for form fields and update form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    set_form_data((form_data) => ({
      ...form_data,
      [name]: value,        // Update only the field that changed
    }));
  };

  // Submit form data to add or update a user
  const handleSubmit = (e) => {
    e.preventDefault();                               // Prevent page refresh on form submit
    const requestMethod = form_data.usr_no ? "PUT" : "POST";  // Decide if it's an add or update

    // Send request to server with form data
    axios({
      method: requestMethod,
      url: "http://localhost/server4react/index.php",
      data: form_data,
    })
      .then((response) => {
        const resp_data = JSON.parse(JSON.stringify(response.data)).data;  // Parse response

        if (resp_data) {                           // If response data is valid
          if (requestMethod === "POST") {          // Add user to users list if it's a POST
            setUsers((users) => [...users, resp_data]);
          } else if (requestMethod === "PUT") {    // Update user if it's a PUT
            setUsers((users) =>
              users.map((u) => (u.usr_no === form_data.usr_no ? resp_data : u))
            );
          }

          // Reset form to blank state after submit
          set_form_data({
            name: "",
            email: "",
            age: "",
            usr_no: null,
          });
          setIsEditing(false);                     // Set mode back to "Add"
        }
      })
      .catch((error) => {
        console.error("Error submitting the form:", error);  // Log submission errors
      });
  };

  // Set form data with user details to edit and switch to edit mode
  const handleUpdate = (user) => {
    set_form_data({
      name: user.usr_name,
      email: user.usr_email,
      age: user.usr_age,
      usr_no: user.usr_no,
    });
    setIsEditing(true);                            // Switch to editing mode
  };

  // Delete a user with confirmation dialog
  const handleDelete = (user) => {
    if (
      window.confirm(
        `Are you sure you want to delete the user: ${user.usr_name}?`
      )
    ) {
      axios
        .delete(`http://localhost/server4react/index.php?usr_no=${user.usr_no}`) // DELETE request to server
        .then(() => {
          setUsers((prevUsers) =>
            prevUsers.filter((u) => u.usr_no !== user.usr_no)   // Filter out deleted user from list
          );
          console.log("User Deleted:", user);                  // Log deletion success
        })
        .catch((error) => {
          console.error("Error deleting user:", error);         // Log deletion errors
        });
    }
  };


  return (
    <div>
      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {isEditing ? "Update User" : "Add User"}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() =>
                  set_form_data({ name: "", email: "", age: "", usr_no: null })
                }
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
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
                <button type="submit">{isEditing ? "Update" : "Submit"}</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={() => {
          set_form_data({ name: "", email: "", age: "", usr_no: null });
          setIsEditing(false);
        }}
      >
        Add User
      </button>

      <div className="search">
        <input
          type="text"
          placeholder="Search by name, email or age"
          value={searchInput}
          onChange={handleSearch}
        />
      </div>
      <hr />

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
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => handleUpdate(user)} // Set the form data for editing
                  >
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
        <p>No users found.</p>
      )}
    </div>
  );
}

export default UserForm;
