import React from "react";
import "./UserGrid.css"; 

// UserGrid functional component to display the list of users
const UserGrid = ({ users, handleUpdate, handleDelete }) => {
  return (
    <div className="user-grid">
      <h3>Submitted Users:</h3>
      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
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
};

export default UserGrid;  // Export UserGrid component
