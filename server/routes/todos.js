
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

module.exports = (io) => {
  const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController')(io);

  // @route   GET api/todos
  // @desc    Get all todos for a user
  // @access  Private
  router.get('/', auth, getTodos);

  // @route   POST api/todos
  // @desc    Create a new todo
  // @access  Private
  router.post('/', auth, createTodo);

  // @route   PUT api/todos/:id
  // @desc    Update a todo
  // @access  Private
  router.put('/:id', auth, updateTodo);

  // @route   DELETE api/todos/:id
  // @desc    Delete a todo
  // @access  Private
  router.delete('/:id', auth, deleteTodo);

  return router;
};
