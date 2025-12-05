import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RequestMaterial from './pages/Employee/RequestMaterial';
import MainLayout from './MainLayout';
import PendingMaterialRequests from './pages/Manager/PendingMaterialRequests';
import DetailPendingMaterial from './pages/Manager/DetailPendingMaterial';
import PendingMaterialReqPurchase from './pages/Purchase/PendingMaterialReqPurchase';
import DetailPendMaterialPurc from './pages/Purchase/DetailPendMaterialPurc';
import PrivateRoute from './utils/PrivateRoute';
import { EmployeeAccountDetails } from './pages/EmployeeAccountDetails';
import ProjectDetails from './pages/ProjectDetails';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageDepartments from './pages/ManageDepartments';
import MyProjects from './pages/MyProjects';
import ViewMaterialRequests from './pages/ViewMaterialRequests';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import ViewManagerActions from './pages/Manager/ViewManagerActions';
import ViewPurchaseActions from './pages/Purchase/ViewPurchaseActions';




const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />


          <Route
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/users" element={<ManageUsers />} />
            <Route path="/dashboard/admin/departments" element={<ManageDepartments />} />
            <Route path="/dashboard/my-projects" element={<MyProjects />} />
            <Route path="/dashboard/view-material-requests" element={<ViewMaterialRequests />} />
            <Route path="/dashboard/view-material-requests/details" element={<DetailPendingMaterial />} />
            <Route path="/dashboard/employee/request-for-material" element={<RequestMaterial />} />
            <Route path="/dashboard/manager/pending-material-requests" element={<PendingMaterialRequests />} />
            <Route path="/dashboard/manager/view-actions" element={<ViewManagerActions />} />
            <Route path="/dashboard/purchase/pending-material-requests" element={<PendingMaterialReqPurchase />} />
            <Route path="/dashboard/purchase/view-actions" element={<ViewPurchaseActions />} />
            <Route path="/dashboard/manager/pending-material-requests/details" element={<DetailPendingMaterial />} />
            <Route path="/dashboard/purchase/pending-material-requests/details" element={<DetailPendMaterialPurc />} />
            <Route path="/dashboard/account/details" element={<EmployeeAccountDetails />} />
            <Route path="/dashboard/project/details" element={< ProjectDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};

export default App;
