
const Todo = require('../models/Todo');
const { successResponse, errorResponse } = require('../utils/responseUtils');

module.exports = (io) => {
  // @desc    Get all todos for a user
  const getTodos = async (req, res) => {
    try {
      const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
      successResponse(res, 'Todos fetched successfully', todos);
    } catch (error) {
      console.error(error.message);
      errorResponse(res, 'Server Error');
    }
  };

  // @desc    Create a new todo
  const createTodo = async (req, res) => {
    const { title, description } = req.body;

    try {
      const newTodo = new Todo({
        user: req.user.id,
        title,
        description,
      });

      const todo = await newTodo.save();
      io.to(req.user.id).emit('todoCreated', todo); // Emit event to specific user
      successResponse(res, 'Todo created successfully', todo, 201);
    } catch (error) {
      console.error(error.message);
      errorResponse(res, 'Server Error');
    }
  };

  // @desc    Update a todo
  const updateTodo = async (req, res) => {
    const { title, description, completed } = req.body;

    try {
      let todo = await Todo.findById(req.params.id);

      if (!todo) {
        return errorResponse(res, 'Todo not found', 404);
      }

      // Ensure user owns todo
      if (todo.user.toString() !== req.user.id) {
        return errorResponse(res, 'Not authorized', 401);
      }

      todo.title = title || todo.title;
      todo.description = description || todo.description;
      todo.completed = completed !== undefined ? completed : todo.completed;

      await todo.save();
      io.to(req.user.id).emit('todoUpdated', todo); // Emit event to specific user
      successResponse(res, 'Todo updated successfully', todo);
    } catch (error) {
      console.error(error.message);
      errorResponse(res, 'Server Error');
    }
  };

  // @desc    Delete a todo
  const deleteTodo = async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);

      if (!todo) {
        return errorResponse(res, 'Todo not found', 404);
      }

      // Ensure user owns todo
      if (todo.user.toString() !== req.user.id) {
        return errorResponse(res, 'Not authorized', 401);
      }

      await Todo.deleteOne({ _id: req.params.id });
      io.to(req.user.id).emit('todoDeleted', todo._id); // Emit event to specific user
      successResponse(res, 'Todo removed successfully', null);
    } catch (error) {
      console.error(error.message);
      errorResponse(res, 'Server Error');
    }
  };

  return {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  };
};
