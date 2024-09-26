import React from "react";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { PiBed } from "react-icons/pi";
import logo from "../../assets/img/logo_light.svg";
function Sidebar() {
  return (
    <>
      <div className="sidebar" data-background-color="dark">
        <div className="sidebar-logo">
          {/* <!-- Logo Header --> */}
          <div className="logo-header" data-background-color="dark">
            <a href="#" className="logo">
              <img
                src={logo}
                alt="navbar brand"
                className="navbar-brand"
                height="20"
              />
            </a>
            <div className="nav-toggle">
              <button className="btn btn-toggle toggle-sidebar">
                <i className="gg-menu-right"></i>
              </button>
              <button className="btn btn-toggle sidenav-toggler">
                <i className="gg-menu-left"></i>
              </button>
            </div>
            <button className="topbar-toggler more">
              <i className="gg-more-vertical-alt"></i>
            </button>
          </div>
          {/* <!-- End Logo Header --> */}
        </div>
        <div className="sidebar-wrapper scrollbar scrollbar-inner">
          <div className="sidebar-content">
            <ul className="nav nav-secondary">
              <li className="nav-item active">
                <a
                  data-bs-toggle="collapse"
                  href="#patients"
                  className="collapsed"
                  aria-expanded="false"
                >
                  <FaRegUser
                    style={{ fontSize: "24px", marginRight: "10px" }}
                  />
                  <p>Patients</p>
                  <span className="caret"></span>
                </a>
                <div className="collapse" id="patients">
                  <ul className="nav nav-collapse">
                    <li>
                      <Link to={"/patient"}>All Patient</Link>
                    </li>
                    <li>
                      <Link to={"/add-patient"}>Add Patient</Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="nav-item active">
                <a
                  data-bs-toggle="collapse"
                  href="#dialysis"
                  className="collapsed"
                  aria-expanded="false"
                >
                  <PiBed style={{ fontSize: "24px", marginRight: "10px" }} />
                  <p>Dislysis</p>
                  <span className="caret"></span>
                </a>
                <div className="collapse" id="dialysis">
                  <ul className="nav nav-collapse">
                    <li>
                      <Link to={"/dialysis-details"}>All Dialysis</Link>
                    </li>
                    <li>
                      <Link to={"/book-dialysis"}>Book Dialysis</Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
