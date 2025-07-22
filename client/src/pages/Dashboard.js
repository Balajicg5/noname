
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const socket = io('http://localhost:5000', {
      query: { token },
    });

    socket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    const fetchData = async () => {
      try {
        const userRes = await axios.get('http://localhost:5000/api/auth/user');
        setUser(userRes.data);

        const todosRes = await axios.get('http://localhost:5000/api/todos');
        setTodos(todosRes.data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();

    socket.on('todoCreated', (todo) => {
      console.log('todoCreated event received:', todo);
      setTodos((prevTodos) => [...prevTodos, todo]);
    });

    socket.on('todoUpdated', (updatedTodo) => {
      console.log('todoUpdated event received:', updatedTodo);
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
      );
    });

    socket.on('todoDeleted', (todoId) => {
      console.log('todoDeleted event received:', todoId);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== todoId));
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/todos', {
        title: newTodoTitle,
        description: newTodoDescription,
      });
      // setTodos([...todos, res.data]); // No need to update state here, socket will handle it
      setNewTodoTitle('');
      setNewTodoDescription('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTodo = async (id, updatedFields) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`, updatedFields);
      // setTodos(todos.map((todo) => (todo._id === id ? res.data : todo))); // No need to update state here, socket will handle it
      setEditingTodo(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      // setTodos(todos.filter((todo) => todo._id !== id)); // No need to update state here, socket will handle it
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Dashboard</h1>
        {user ? (
          <div className="user-info">
            <p>Welcome, {user.username}!</p>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <p>No user data found.</p>
        )}

        <button onClick={handleLogout} className="logout-button">Logout</button>

        <h2>Your Todos</h2>
        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            placeholder="New Todo Title"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="New Todo Description (optional)"
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
          />
          <button type="submit">Add Todo</button>
        </form>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id} className="todo-item">
              {editingTodo && editingTodo._id === todo._id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editingTodo.title}
                    onChange={(e) =>
                      setEditingTodo({ ...editingTodo, title: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    value={editingTodo.description}
                    onChange={(e) =>
                      setEditingTodo({ ...editingTodo, description: e.target.value })
                    }
                  />
                  <input
                    type="checkbox"
                    checked={editingTodo.completed}
                    onChange={(e) =>
                      setEditingTodo({ ...editingTodo, completed: e.target.checked })
                    }
                  />
                  <button onClick={() => handleUpdateTodo(todo._id, editingTodo)}>
                    Save
                  </button>
                  <button onClick={() => setEditingTodo(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <h3>{todo.title}</h3>
                  <p>{todo.description}</p>
                  <p>Completed: {todo.completed ? 'Yes' : 'No'}</p>
                  <div className="todo-actions">
                    <button onClick={() => setEditingTodo(todo)}>Edit</button>
                    <button onClick={() => handleDeleteTodo(todo._id)} className="delete-button">Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
