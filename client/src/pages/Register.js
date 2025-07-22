
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import '../styles/forms.css';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage(result.message);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Register</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" {...register('username', { required: true })} />
            {errors.username && <span>This field is required</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" {...register('email', { required: true })} />
            {errors.email && <span>This field is required</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" {...register('password', { required: true })} />
            {errors.password && <span>This field is required</span>}
          </div>
          <button type="submit" className="form-button">Register</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
