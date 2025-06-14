import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const [form, setForm] = useState({ email:'', password:'', name:'', type:'user' });
  const navigate = useNavigate();

  const handle = async e => {
    e.preventDefault();
    try {
      await signup(form);
      navigate(form.type === 'workshop' ? '/dashboard/workshop' : '/dashboard/user');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handle}>
      <h2>Sign Up</h2>
      <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required/>
      <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required/>
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required/>
      <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
        <option value="user">User</option>
        <option value="workshop">Workshop</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
  );
}
