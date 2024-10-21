import React from "react";
import './UserGrid.css';

function UserGrid({ users, onUpdate, onDelete }) {
  return (
    <div className="user-grid">
      <h3>Submitted Users:</h3>
      {users.length > 0 ? (
        <table >
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Actions</th> {/* Actions column */}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
                <td>
                  {/* Update Button */}
                  <button onClick={() => onUpdate(user)}>
                  <i class="bi bi-pencil-square"></i>
                  </button>
                  {/* Delete Button */}
                  <button onClick={() => onDelete(user)}>
                  <i class="bi bi-trash3-fill"></i>
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

export default UserGrid;
