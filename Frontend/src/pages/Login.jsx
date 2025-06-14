import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('user');
  const navigate = useNavigate();

  const handle = async e => {
    e.preventDefault();
    try {
      await login(email, password, type);
      navigate(type === 'workshop' ? '/dashboard/workshop' : '/dashboard/user');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handle}>
      <h2>Log In</h2>
      <label>
        Email:<input value={email} onChange={e => setEmail(e.target.value)} required/>
      </label>
      <label>
        Password:<input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
      </label>
      <label>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="user">User</option>
          <option value="workshop">Workshop</option>
        </select>
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
