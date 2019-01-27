import React from 'react';
import {Link} from 'react-router';

let auth = require('./utils');

import FormInput from '../ui/form/formInput';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login_error: false,

            username: '',
            password: '',
        };

        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleSubmit(event) {
        event.preventDefault();

        let username = this.state.username;
        let pass = this.state.password;

        auth.login(username, pass, (loggedIn) => {
            if (loggedIn) {
                this.context.router.replace('/app/search')
                location.reload();
      
            } else {
                this.setState({login_error: true})
            }
        })
    }

    render() {
        return <div className="container">
            <h1>Login</h1>
            <div className="panel panel-info profile_form_panel">
                <div className="panel-body p25 ">
                    <div className="m0 pt25 row row-eq-height">
                        <div className="col-xs-7">
                            <form onSubmit={this.handleSubmit}>
                                <FormInput type='text' placeholder='username' labelText='Username: '
                                           onChange={(e) => (this.setState({username: e.target.value}))}/>
                                <FormInput type='password' placeholder='password' labelText='Password: '
                                           onChange={(e) => (this.setState({password: e.target.value}))}/>
                                <div className='panel-footer clearfix'>
                                    <input type="submit" className='pull-right btn update_button' value='Login'/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

Login.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Login