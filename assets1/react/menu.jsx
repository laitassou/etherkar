import React from 'react';
import {Link} from 'react-router';

let auth = require('./auth/utils');

import LastTravelList from './lasttravels/LastTravelList';


import ReactDOM from 'react-dom';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
        };
        this.redirectToLogin = this.redirectToLogin.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this);
    }

    redirectToLogin(e) {
        e.preventDefault();
        this.context.router.replace('/app/login')
    }

    logoutHandler(e) {
        e.preventDefault();
        auth.logout();
        this.forceUpdate();  
        //this.context.router.replace('/app/login')
    }

    toggleClass() {
        //const currentState = this.state.active;
        //this.setState({ active: !currentState });
    };

    render() {
        const OnlyAuthLinks = () => (
            <ul>
                 <li>  <a href="/app/dashboard" onClick={this.toggleClass} className={this.state.active ? 'your_className': null} >Dashboard</a>   </li>
                 <li>  <a href="/app/cars" onClick={this.toggleClass} className={this.state.active ? 'your_className': null}>Car</a>   </li>
                 <li>  <a href="/app/profile" onClick={this.toggleClass} className={this.state.active ? 'your_className': null}>Profile</a>   </li>                 
                <li> <a href="/app/travels" onClick={this.toggleClass} className={this.state.active ? 'your_className': null}>Add Travel</a> </li>
                <li > <a href="/app/travelsearch" onClick={this.toggleClass} className={this.state.active ? 'active': null} >Search Travel</a> </li>                
                <li > <a onClick={this.logoutHandler} >Logout</a>  </li>
          </ul>
        );


        const OnlyGuestLinks = () => (
          <ul>
                <li > <a href="/app/travelsearch" onClick={this.toggleClass} className={this.state.active ? 'active': null} >Search Travel</a> </li>    
                <li > <a href="/app/signup" onClick={this.toggleClass} className={this.state.active ? 'active': null}>Sign Up</a>  </li>
                <li > <a href="/app/login" onClick={this.toggleClass} className={this.state.active ? 'active': null} >Login</a> </li>
         </ul>
        );


        return (
              auth.loggedIn() ? <OnlyAuthLinks/> : <OnlyGuestLinks/> 
        )
    }
}


/*
Menu.contextTypes = {
    router: React.PropTypes.object.isRequired
};
*/



export default Menu


