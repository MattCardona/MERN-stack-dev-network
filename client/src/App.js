import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken.js';
import { setCurrentUser, logoutUser } from './actions/authActions.js';
import { clearCurrentProfile } from './actions/profileActions.js';

import PrivateRoute from './components/common/PrivateRoute.js';
import Navbar from './components/layout/Navbar.js';
import Footer from './components/layout/Footer.js';
import Landing from './components/layout/Landing.js';
import Register from './components/auth/Register.js';
import Login from './components/auth/Login.js';
import Dashboard from './components/dashboard/Dashboard.js';
import CreateProfile from './components/create-profile/CreateProfile.js';
import EditProfile from './components/edit-profile/EditProfile.js';
import AddExperience from './components/add-credentials/AddExperience.js';
import AddEducation from './components/add-credentials/AddEducation.js';
import Profiles from './components/profiles/Profiles.js';
import Profile from './components/profile/Profile.js';
import Posts from './components/posts/Posts.js';
import Post from './components/post/Post.js';
import NotFound from './components/not-found/NotFound.js';


import './App.css';

// check for token
if(localStorage.jwtToken){
  // set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // decode token and get user info
  const decode = jwt_decode(token);
  // set user and isAuthenticated
  store.dispatch(setCurrentUser(decode));
  // check for any expired tokens
  const currentTime = Date.now() / 1000;
  if(decode.exp < currentTime){
    // logout user
    store.dispatch(logoutUser());
    // clear current Profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div className="App">
            <Navbar />
            <Route path="/" component={ Landing } exact />
            <div className="container">
              <Route exact path="/register" component={ Register } />
              <Route exact path="/login" component={ Login } />
              <Route exact path="/profiles" component={ Profiles } />
              <Route exact path="/profile/:handle" component={ Profile } />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={ Dashboard } />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/create-profile" component={ CreateProfile } />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/edit-profile" component={ EditProfile } />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/add-experience" component={ AddExperience } />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/add-education" component={ AddEducation } />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/feed" component={ Posts } />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/post/:id" component={ Post } />
              </Switch>
              <Route exact path="/not-found" component={ NotFound } />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
