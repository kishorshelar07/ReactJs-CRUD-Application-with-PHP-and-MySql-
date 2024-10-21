import React, { useState } from "react";
import axios from "axios"; // Import Axios
import UserGrid from "./UserGrid"; // Import UserGrid component
import './form.css'

function UserForm() {
  const [form_data, setFormData] = useState({
    name: "",
    email: "",
    age: "",
  });
  const [users, setUsers] = useState([]); // Store multiple users

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((form_data) => ({
      ...form_data,
      [name]: value,
    }));
  };

  

  // Handle form submission using Axios
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted!");

    axios.post("http://localhost/server4react/index.php", form_data)
      .then((response) => {
        console.log("Full Response from server:", response);
        const jsonResponse = response.data;
        const jsonStart = jsonResponse.indexOf('{');
        const jsonString = jsonResponse.substring(jsonStart);
        console.log("json string:", jsonString);

        try {
          const resp_data = JSON.parse(jsonString);
          console.log("Parsed Response Data:", resp_data);

          if (resp_data && resp_data.data) {
            setUsers((users) => [...users, resp_data.data]);
          } else {
            console.error("Invalid data received from server:", resp_data);
          }

          setFormData({
            name: "",
            email: "",
            age: "",
          });
        } catch (error) {
          console.error("Error parsing JSON response:", error);
        }
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
      });
  };

  return (
    <div>
      <h2>User Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={form_data.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="email" value={form_data.email} onChange={handleChange} required />
        </div>

        <div>
          <label>Age:</label>
          <input type="number" name="age" value={form_data.age} onChange={handleChange} required />
        </div>

        <button type="submit">Submit</button>
      </form>

      {/* Use the UserGrid component to display users */}
      <UserGrid users={users} />
    </div>
  );
}

export default UserForm;
