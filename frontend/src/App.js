import React, { Fragment , useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layouts/Navbar'
import Landing from './components/layouts/Landing'
import Register from './components/auth/register'
import Login from './components/auth/login'
import Alert from './components/layouts/alert'
import setAuthToken from './utils/setAuthToken'
import Dashboard from './components/dashboard/Dashboard'
import CreateProfile from './components/profile-forms/createProfile'
import PrivateRoute from './components/routing/privateRoute';
import editprofile from './components/profile-forms/editprofile'
import addExperience from './components/profile-forms/addExperience'
import addEducation from './components/profile-forms//addEducation'
//Redux imports
import { Provider } from 'react-redux';
import store from './store';
import {loadUser} from './actions/auth';


if(localStorage.token)
  {
    setAuthToken(localStorage.token);
  }


const App = () => {
  useEffect(()=>{
  store.dispatch(loadUser())
  },[]);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing}></Route>
          <section className="container">
          <Alert />
            <Switch>
              <Route exact path="/register" component={Register}></Route>
              <Route exact path="/login" component={Login}></Route>
              <PrivateRoute exact path="/dashboard" component={Dashboard}></PrivateRoute>
              <PrivateRoute exact path="/create-profile" component={CreateProfile}></PrivateRoute>
              <PrivateRoute exact path="/edit-profile" component={editprofile}></PrivateRoute>
              <PrivateRoute exact path="/add-experience" component={addExperience}></PrivateRoute>
              <PrivateRoute exact path="/add-education" component={addEducation}></PrivateRoute>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
