import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, Redirect} from 'react-router'
import getWeb3 from './util/web3/getWeb3'

import Base from './base';
import Cars from './cars/index';
import Login from './auth/login';
import Signup from './auth/signup';
import Profile from './profile/profile';
import TravelForm from './travelform/TravelForm';
import TravelFormEditor from './travelform/TravelFormEditor';

import TravelListForm from './travels/TravelListForm';


import requireAuth from './auth/permissions';
import Dashboard from './dashboard/index';


import Menu from './menu';


import Faqs from './faqs/faqs';
import About from './about/about';
import Contact from './contact/contact';

import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { UserIsAuthenticated, UserIsNotAuthenticated } from './util/wrappers.js'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Redux Store
import store from './store'

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store)

// Initialize web3 and set in Redux.
getWeb3
.then(results => {
  console.log('Web3 initialized!')
})
.catch(() => {
  console.log('Error in web3 initialization.')
})



const App = () => (
    <MuiThemeProvider>
    <Router history={browserHistory}>
        <Route path='/app' component={Base} />        
            <Route path='/app/login' component={Login}/>
            <Route path='/app/profile' component={Profile}/>
            <Route path='/app/dashboard' component={Dashboard}/>
            <Route path='/app/signup' component={Signup}/>
            <Route path='/app/cars' component={Cars} onEnter={requireAuth}/>
            <Route path='/app/travels' component={TravelForm} onEnter={requireAuth}/>
            <Route path='/app/travelsearch' component={TravelListForm} />
            <Route path='/app/faqs' component={Faqs} />
            <Route path='/app/about' component={About} />
            <Route path='/app/contact' component={Contact} />      
            <Route path='/app/traveledit/:travelid' component={TravelFormEditor} />     

       
        <Redirect from="/*" to="/app"/>
    </Router>
    </MuiThemeProvider>
  );






ReactDOM.render(
    <App />,
    document.getElementById('app')
);

ReactDOM.render(
    <Menu />,
    document.getElementById('menu')
);

