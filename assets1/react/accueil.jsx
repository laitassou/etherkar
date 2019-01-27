import React from 'react';
import {Link} from 'react-router';

let auth = require('./auth/utils');


class Acceuil extends React.Component {
    constructor(props) {
        super(props);
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
        this.context.router.replace('/app/login')
    }

    render() {

        const OnlyAuthLinks = () => (

    
            <header class="page_header">
            <div class="dashbord_header">
                <div class="container">
                    <div class="row">
                        <a href="#" class="col-lg-3 logo">
                            <div class="logo__img"><img src="/static/react/ui/images/logo.png" alt="logo" /> </div>
                            <div class="logo__text"> <span>Ether</span> <span>KAR</span></div>
                        </a>
                        <nav class="col-lg-9 ml-auto main_nav">
                            <ul>
                          <li className="pure-menu-item">
                            <Link to="/app/dashboard" className="pure-menu-link">Dashboard</Link>
                          </li>
                          <li className="pure-menu-item">
                            <Link to="/app/profile" className="pure-menu-link">Profile</Link>
                          </li>
                          <li className="pure-menu-item">
                            <Link to="/app/cars" className="pure-menu-link">Cars</Link>
                          </li>
                          <li className="pure-menu-item">
                            <Link to="/app/travels" className="pure-menu-link">Add Travel</Link>
                          </li>
                          <li className="pure-menu-item">
                            <Link to="/app/travelsearch" className="pure-menu-link">Search Travel</Link>
                          </li>                
                          <li className="pure-menu-item">
                            <a onClick={this.logoutHandler} className="pure-menu-link">Logout</a>
                          </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>


        );


        const OnlyGuestLinks = () => (

                <header class="page_header">
                            <div class="dashbord_header">
                                <div class="container">
                                    <div class="row">
                                        <a href="#" class="col-lg-3 logo">
                                            <div class="logo__img"><img src="/static/react/ui/images/logo.png" alt="logo" /> </div>
                                            <div class="logo__text"> <span>Ether</span> <span>KAR</span></div>
                                        </a>
                                        <nav class="col-lg-9 ml-auto main_nav">
                                            <ul>

                                        <li className="pure-menu-item">
                                            <Link to="/app/travelsearch" className="pure-menu-link">Search Travel</Link>
                                        </li>    
                                        <li className="pure-menu-item">
                                            <Link to="/app/signup" className="pure-menu-link">Sign Up</Link>
                                        </li>
                                        <li className="pure-menu-item">
                                            <a onClick={this.redirectToLogin} className="pure-menu-link">Login</a>
                                        </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </header>

       
        );

        return (
          <div>
                <div className="App">
                        <ul className="pure-menu-list navbar-right">
                            {auth.loggedIn() ? <OnlyAuthLinks/> : <OnlyGuestLinks/>}
                        </ul>
                    <main className="container">
                        <div className="pure-g">
                            <div className="pure-u-1-1">
                                {this.props.children}                    
                            </div>
                        </div>
                    </main>
                </div>

            <section class="advantages">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-4 advantage_item">
                            <div class="advantage_item_image sharing"></div>
                            <h3 class="advantage_item_title">social sharing</h3>
                            <div class="advantage_item_text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </div>
                        </div>
                        <div class="col-lg-4 advantage_item">
                            <div class="advantage_item_image price"></div>
                            <h3 class="advantage_item_title">low cost</h3>
                            <div class="advantage_item_text">Economy cars at everyday prices are always available. For special occasions, no occasion at all, or when you just a need a bit more room, call a black car or SUV.</div>
                        </div>
                        <div class="col-lg-4 advantage_item">
                            <div class="advantage_item_image wherewer"></div>
                            <h3 class="advantage_item_title">Anywhere, anytime</h3>
                            <div class="advantage_item_text">Daily commute. Errand across town. Early morning flight. Late night drinks. Wherever you’re headed, count on Uber for a ride—no reservations required.</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 d-flex justify-content-center">
                            <button> I want to travel</button>
                        </div>
                    </div>
                </div>
                </section>

        </div>
        )
    }
}

Acceuil.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Acceuil