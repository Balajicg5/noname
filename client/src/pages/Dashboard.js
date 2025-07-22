
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center p-5 box-border min-h-screen text-current"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/15 backdrop-blur-md border border-white/20 p-8 rounded-lg shadow-lg w-full max-w-4xl text-center mb-5"
      >
        <h1 className="text-3xl font-bold mb-5 text-current">Dashboard</h1>
        {user ? (
          <div className="mb-5">
            <p className="text-lg text-current">Welcome, {user.username}!</p>
            <p className="text-md text-current">Email: {user.email}</p>
          </div>
        ) : (
          <p>No user data found.</p>
        )}

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-600 text-white px-5 py-2 rounded-md text-base cursor-pointer hover:bg-red-700 transition-colors duration-300"
        >
          Logout
        </motion.button>

        <h2 className="text-2xl font-bold mt-8 mb-5 text-current">Your Todos</h2>
        <form onSubmit={handleAddTodo} className="flex flex-wrap gap-3 justify-center mb-8">
          <input
            type="text"
            placeholder="New Todo Title"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            required
            className="flex-1 p-2 border border-white/20 rounded-md text-base min-w-[150px] bg-white/10 text-current"
          />
          <input
            type="text"
            placeholder="New Todo Description (optional)"
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            className="flex-1 p-2 border border-white/20 rounded-md text-base min-w-[150px] bg-white/10 text-current"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-5 py-2 rounded-md text-base cursor-pointer hover:bg-green-700 transition-colors duration-300"
          >
            Add Todo
          </motion.button>
        </form>

        <ul className="list-none p-0 w-full">
          {todos.map((todo) => (
            <motion.li
              key={todo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/15 border border-white/20 rounded-lg mb-3 p-4 flex flex-col items-start text-left"
            >
              {editingTodo && editingTodo._id === todo._id ? (
                <div className="w-full">
                  <input
                    type="text"
                    value={editingTodo.title}
                    onChange={(e) =>
                      setEditingTodo({ ...editingTodo, title: e.target.value })
                    }
                    className="w-full p-2 border border-white/20 rounded-md mb-2 bg-white/10 text-current"
                  />
                  <input
                    type="text"
                    value={editingTodo.description}
                    onChange={(e) =>
                      setEditingTodo({ ...editingTodo, description: e.target.value })
                    }
                    className="w-full p-2 border border-white/20 rounded-md mb-2 bg-white/10 text-current"
                  />
                  <label className="inline-flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={editingTodo.completed}
                      onChange={(e) =>
                        setEditingTodo({ ...editingTodo, completed: e.target.checked })
                      }
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-current">Completed</span>
                  </label>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => handleUpdateTodo(todo._id, editingTodo)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-700 transition-colors duration-300"
                    >
                      Save
                    </motion.button>
                    <motion.button
                      onClick={() => setEditingTodo(null)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-600 transition-colors duration-300"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <h3 className="text-xl font-semibold mb-1 text-blue-400">{todo.title}</h3>
                  <p className="text-current mb-2">{todo.description}</p>
                  <p className="text-current text-sm">Completed: {todo.completed ? 'Yes' : 'No'}</p>
                  <div className="flex space-x-2 mt-3">
                    <motion.button
                      onClick={() => setEditingTodo(todo)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-700 transition-colors duration-300"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteTodo(todo._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-red-700 transition-colors duration-300"
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
