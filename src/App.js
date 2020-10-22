import React, { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import * as Icons from "@material-ui/icons";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
// import BoardModerator from "./components/BoardModerator";
// import BoardAdmin from "./components/BoardAdmin";


const App = () => {
  // const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  // const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      // setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      // setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          <Icons.NetworkCheck /> WiTrack

        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li>


          <li className="nav-item" >
            <HashLink to="/home#about" className="nav-link">About</HashLink>
          </li>
          <li className="nav-item" >
            <HashLink to="/home#contact" className="nav-link">Contact</HashLink>
          </li>

          {currentUser && (
            <li className="nav-item">
              <Link to={"/dashboard"} className="nav-link">
                Dashboard
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              {/*<Link to={"/profile"} className="nav-link">*/}
              <Link to={"/dashboard"} className="nav-link">
                <Icons.AccountCircle />
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            {/*<li className="nav-item">*/}
            {/*  <Link to={"/register"} className="nav-link">*/}
            {/*    Sign Up*/}
            {/*  </Link>*/}
            {/*</li>*/}
          </div>
        )}
      </nav>

      <div>
        <Switch>
          <Route exact path={["/","/home"]} component={Home} />
          <Route exact path={["/login"]} component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/dashboard" component={BoardUser} />
          {/*<Route path="/mod" component={BoardModerator} />*/}
          {/*<Route path="/admin" component={BoardAdmin} />*/}

        </Switch>
      </div>
    </div>
  );
};

export default App;
