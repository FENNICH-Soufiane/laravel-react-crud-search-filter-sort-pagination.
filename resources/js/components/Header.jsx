import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation();
  return (
    <div>

      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Laravel React CRUD App</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} aria-current="page" to="/"><i className="fa-solid fa-house"></i> Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`} to="/create"><i className="fas fa-edit"></i> Create Task</Link>
              </li>


            </ul>

          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header