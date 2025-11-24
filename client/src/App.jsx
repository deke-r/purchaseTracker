import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RequestMaterial from './pages/Employee/RequestMaterial';
import MainLayout from './MainLayout';
import PendingMaterialRequests from './pages/Manager/PendingMaterialRequests';
import DetailPendingMaterial from './pages/Manager/DetailPendingMaterial';
import PendingMaterialReqPurchase from './pages/Purchase/PendingMaterialReqPurchase';
import DetailPendMaterialPurc from './pages/Purchase/DetailPendMaterialPurc';
import PrivateRoute from './utils/PrivateRoute';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
 
        <Route path="/" element={<Login />} />
      

        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/employee/request-for-material" element={<RequestMaterial />} />
          <Route path="/dashboard/manager/pending-material-requests" element={<PendingMaterialRequests />} />
          <Route path="/dashboard/purchase/pending-material-requests" element={<PendingMaterialReqPurchase />} />
          <Route path="/dashboard/manager/pending-material-requests/details" element={<DetailPendingMaterial />} />
          <Route path="/dashboard/purchase/pending-material-requests/details" element={<DetailPendMaterialPurc />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
