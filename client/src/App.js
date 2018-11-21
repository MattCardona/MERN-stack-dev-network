import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken.js';
import { setCurrentUser } from './actions/authActions.js';


import Navbar from './components/layout/Navbar.js';
import Footer from './components/layout/Footer.js';
import Landing from './components/layout/Landing.js';
import Register from './components/auth/Register.js';
import Login from './components/auth/Login.js';
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
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
