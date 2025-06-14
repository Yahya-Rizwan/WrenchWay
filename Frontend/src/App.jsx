import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './auth/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RequestForm from './components/RequestForm'; // your existing page
import WorkshopList from './components/WorkshopList';

function Protected({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/dashboard/user" element={<Protected><RequestForm/></Protected>} />
          <Route path="/dashboard/workshop" element={<Protected><WorkshopList/></Protected>} />
          <Route path="*" element={<Navigate to="/login"/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
