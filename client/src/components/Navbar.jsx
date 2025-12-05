import React from 'react';
import { Link } from 'react-router-dom';
const logout = () => {
  localStorage.clear();
  window.location.href = '/';
};

const Navbar = ({ id, name, role }) => {
  return (
    <nav className="navbar navbar-expand-lg py-3 bg-b">
      <div className="container-fluid">
        <Link className="navbar-brand text-light ms-md-5 text-uppercase f_14 fw-semibold" to="/dashboard">
          SPPL Purchase Tracking
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto me-md-5">
            <li className="nav-item mx-3">
              <Link className="nav-link text-light f_14 fw-semibold" to="/dashboard">
                <i className="fa-solid fa-home me-2"></i>
                Home
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link className="nav-link f_14 fw-semibold active text-light" to="#">
                <i className="fa-solid fa-user me-2"></i>
                {id} &nbsp;:&nbsp; {name}
              </Link>
            </li>
            
            <li className="nav-item mx-3">
              <Link className="nav-link text-light text-capitalize f_14 fw-semibold" to="#">
                <i className="fa-solid fa-id-card me-2"></i>
                Account Type : &nbsp;
                {role}
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link className="nav-link text-light text-capitalize f_14 fw-semibold" onClick={logout}>
                <i className="fa-solid fa-power-off me-2"></i>
                Logout
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
