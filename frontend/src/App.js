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
import PrivateRoute from './components/routing/privateRoute';
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
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
