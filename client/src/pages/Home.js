
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
  const MotionLink = motion(Link);
const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-5 box-border text-center text-white"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/15 backdrop-blur-md border border-white/20 p-10 rounded-lg shadow-lg w-full max-w-xl"
      >
        <h1 className="text-blue-400 text-4xl font-bold mb-5">Welcome to Zenith Task</h1>
        <p className="text-lg leading-relaxed mb-8">
          Organize your life and boost your productivity with our intuitive task management application.
          Manage your tasks, set reminders, and achieve your goals with ease.
        </p>
        <div className="flex justify-center space-x-4">
          <MotionLink
            
            to="/login"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg no-underline hover:bg-blue-700 transition-colors duration-300"
          >
            Login
          </MotionLink>
          <MotionLink
           
            to="/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg no-underline hover:bg-blue-700 transition-colors duration-300"
          >
            Register
          </MotionLink>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
