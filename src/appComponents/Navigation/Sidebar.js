import React from "react";
import { Link, withRouter } from "react-router-dom";

import sidebarRoutes from "routes/sidebar";

import LogoutButton from "appComponents/Auth/LogoutButton";

const logo = require("assets/img/logo.svg");

function renderSubitems(subitems, currentPath) {
  let jsxToRender = subitems.map((subitem, index) => (
    <li key={subitem.route}>
      <Link className={subitem.route === currentPath ? "active" : null} to={subitem.route}>
        {subitem.displayName}
      </Link>
    </li>
  ));
  return jsxToRender;
}

const Sidebar = ({ location }) => (
  <div
    className="sidebarWrapper"
    id="sidebar"
    onClick={() => {
      document.getElementById("sidebar").style.display = "none";
    }}
  >
    {/* document.getElementById("sidebar").style.display = "initial"; */}
    <nav className="sidebar">
      <div className="sidebar-header">
        <Link to="/">
          <img alt="logo" className="logo" src={logo} />
        </Link>
      </div>
      <ul className="list-unstyled components">
        {sidebarRoutes.map((sidebarElement, index) => {
          let activeClass = "";
          if (location.pathname === sidebarElement.route) {
            activeClass = "active";
          }

          if (sidebarElement.subitems && sidebarElement.subitems.length) {
            return (
              <li className={`mainLink ${activeClass}`} key={index}>
                <a
                  href={`#submenu${index}`}
                  data-toggle="collapse"
                  aria-expanded="false"
                  className="dropdown-toggle"
                >
                  <i className="far fa-envelope" />
                  {sidebarElement.displayName}
                </a>
                <ul className="collapse list-unstyled subLinks" id={`submenu${index}`}>
                  {renderSubitems(sidebarElement.subitems, location.pathname)}
                </ul>
              </li>
            );
          } else {
            return (
              <li className={`mainLink ${activeClass}`} key={index}>
                <Link to={sidebarElement.route}>
                  <i
                    className={`${
                      sidebarElement.iconClass && sidebarElement.iconClass.length
                        ? sidebarElement.iconClass
                        : "far fa-envelope"
                    }`}
                  />
                  {sidebarElement.displayName}
                </Link>
              </li>
            );
          }
        })}
        <li className="mainLink">
          <a href="">
            <LogoutButton iconclass="fas fa-power-off" text="Log out" />
          </a>
        </li>
      </ul>
    </nav>
  </div>
);

export default withRouter(Sidebar);
