import React from 'react';
import MaterialRequestForm from '../components/MaterialRequestForm';
import { EmployeeDashboard } from '../components/EmployeeDashboard';
import { jwtDecode } from 'jwt-decode';
import ManagerDashboard from '../components/ManagerDashboard';
import PurchaseDashboard from '../components/PurchaseDashboard';

const Dashboard = () => {
  let role = '';

  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (err) {
      console.error('Token decoding failed:', err);
    }
  }


  let dashboardComponent;
  {
    if (role === 'employee') {
      dashboardComponent = <EmployeeDashboard />
    } else if (role === 'manager') {
      dashboardComponent = <ManagerDashboard />
    } else if (role === 'purchase') {
      dashboardComponent = <PurchaseDashboard />
    }
  }


  return (
    <>

      {dashboardComponent}


    </>
  );
};

export default Dashboard;
