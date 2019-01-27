import React from 'react';
import {Link} from 'react-router';

let auth = require('./auth/utils');

import LastTravelList from './lasttravels/LastTravelList';


import ReactDOM from 'react-dom';

class Base extends React.Component {
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
            <span>
                <li className="pure-menu-item">
                  <Link to="/app/about" className="pure-menu-link">Terms</Link>
                </li>
                <li className="pure-menu-item">
                  <Link to="/app/faqs" className="pure-menu-link">FAQs</Link>
                </li>
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
            </span>
        );


        const OnlyGuestLinks = () => (
            <span>
                <li className="pure-menu-item">
                  <Link to="/app/about" className="pure-menu-link">Terms</Link>
                </li>
                <li className="pure-menu-item">
                  <Link to="/app/faqs" className="pure-menu-link">FAQs</Link>
                </li>
                <li className="pure-menu-item">
                  <Link to="/app/travelsearch" className="pure-menu-link">Search Travel</Link>
                </li>    
                <li className="pure-menu-item">
                  <Link to="/app/signup" className="pure-menu-link">Sign Up</Link>
                </li>
                <li className="pure-menu-item">
                  <a onClick={this.redirectToLogin} className="pure-menu-link">Login</a>
                </li>
            </span>
        );


        return (

        <div>

                <div className="header1 header">
                    <div className="header_content">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-9 header_content_title">
                                    <h1>Your <span>ride sharing</span> starts </h1><span>Here</span> </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="row header_content_form">
                                <div className="traveling_form">
                                       <div className="logo_img_browser" ><div  className="logo_img_txt"> Access our service by using: </div>  </div>
                                       <div className="logo_img_browser" > <div  className="logo_desc"> Compatible browser              </div> <div className="logo_img"  ><img src="/static/react/ui/images/chrome.png" alt="logo"/></div> <div className="logo_img"> <p>or </p> </div> <div  className="logo_img"><img src="/static/react/ui/images/firefox.png" alt="logo"/></div>  </div>
                                       <div className="logo_img_browser" > <div className="logo_desc"> Metamask plugin        </div> <div className="logo_img"  >  <a href="https://metamask.io/" target="_blank"> <img src="/static/react/ui/images/metamask.png" alt="logo" /> </a> </div> </div>
                                       <div className="logo_img_browser" > <div className="logo_desc"> Your ether account </div> <div className="logo_img"  ><img src="/static/react/ui/images/ether-logo.png" alt="logo"/></div> </div>
                                        <form action="app/signup" name="start_travel_form">
                                        <button type="submit">Start Traveling</button>
                                    </form>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    


                <section className="advantages" >
                <div className="container" id="container"> 
            

                            <div className="row">
                                <div className="col-lg-4 advantage_item">
                                    <div className="advantage_item_image sharing"></div>
                                    <h3 className="advantage_item_title">social sharing</h3>
                                    <div className="advantage_item_text">Share your rides and meet new people. This allows you to support your fees. This is also environnment friendly. </div>
                                </div>
                                <div className="col-lg-4 advantage_item">
                                    <div className="advantage_item_image price"></div>
                                    <h3 className="advantage_item_title">low cost</h3>
                                    <div className="advantage_item_text">Economy cars at everyday prices are always available. We applt low fees for reservations.</div>
                                </div>
                                <div className="col-lg-4 advantage_item">
                                    <div className="advantage_item_image wherewer"></div>
                                    <h3 className="advantage_item_title">Anywhere, anytime</h3>
                                    <div className="advantage_item_text">Regular travels, going to university, to work or simply travalling.</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 d-flex justify-content-center">
                                <iframe  width="1200" height="675" src="https://www.youtube.com/embed/_-ig6VESOQk?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 d-flex justify-content-center">
                             <LastTravelList />
                             </div>
                            </div>
                 </div>
            </section>

        </div>
        )
    }
}



Base.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Base


