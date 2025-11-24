import React from 'react';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const MainLayout = () => {
      let name = '';
      let role = '';
      let id=''
    
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log('decoded:', decoded);
          name = decoded.name;
          role = decoded.role;
          id=decoded.id
        } catch (err) {
          console.error('Token decoding failed:', err);
        }
      }
    
  return (
    <>
        <Navbar name={name} role={role} id={id}/>
      <div className="container mt-4">
        <Outlet /> 
      </div>
    </>
  );
};

export default MainLayout;
