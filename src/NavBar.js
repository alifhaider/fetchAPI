import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/beginner">
        <p>Beginner Fetch API</p>
      </Link>
      <Link to="/intermediate">Intermediate</Link>
    </div>
  );
};

export default NavBar;
