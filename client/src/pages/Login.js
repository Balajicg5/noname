
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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

      if (response.ok) {
        localStorage.setItem('token', result.token);
        navigate('/dashboard');
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input {...register('email', { required: true })} />
          {errors.email && <span>This field is required</span>}
        </div>
        <div>
          <label>Password</label>
          <input type="password" {...register('password', { required: true })} />
          {errors.password && <span>This field is required</span>}
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
