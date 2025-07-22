
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        login(result.data.token);
        navigate('/dashboard');
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-5 box-border"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/15 backdrop-blur-md border border-white/20 p-10 rounded-lg shadow-lg w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-bold mb-6 text-current">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="text-left">
            <label className="block text-current text-sm font-bold mb-2">Email</label>
            <input type="email" {...register('email', { required: true })} className="shadow appearance-none border rounded w-full py-2 px-3 bg-white/10 text-current leading-tight focus:outline-none focus:shadow-outline border-white/20" />
            {errors.email && <span className="text-red-500 text-xs italic">This field is required</span>}
          </div>
          <div className="text-left">
            <label className="block text-current text-sm font-bold mb-2">Password</label>
            <input type="password" {...register('password', { required: true })} className="shadow appearance-none border rounded w-full py-2 px-3 bg-white/10 text-current mb-3 leading-tight focus:outline-none focus:shadow-outline border-white/20" />
            {errors.password && <span className="text-red-500 text-xs italic">This field is required</span>}
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </motion.button>
        </form>
        {message && <p className="text-red-500 text-sm mt-4">{message}</p>}
      </motion.div>
    </motion.div>
  );
};

export default Login;
