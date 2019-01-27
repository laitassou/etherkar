import React from 'react';

let auth = require('./utils');
import FormInput from '../ui/form/formInput';

import { signUpUser } from './SignUpFormActions';

import ReactPhoneInput from 'react-phone-input';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: '',
            user: '',
            phonenumber :'',
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            passwordConfirm: '',
        };

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault();
        let formIsValid = true;
        if(this.state.username !='' &&
        this.state.phonenumber !=''
        /* &&       
        this.state.firstName !='' &&
    this.state.lastName !='' */    )
        {
            formIsValid = true;
        }
        else
        {
            formIsValid = false;
        }
        if (formIsValid == true && this.state.password === this.state.passwordConfirm) {
            let data = {
                username: this.state.username, //this.state.firstName+'.'+((this.state.lastName).charAt(0)).toUpperCase(),
                email: this.state.email,
                /*
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                */
                password: this.state.password,
                phone_number : this.state.phonenumber
            };
            
    
            $.ajax({
                type: 'POST',
                url: '/api/signup/',
                data: data,
                success: function () {
                    auth.login(this.state.username, this.state.password, () => {
                       // signUpUser(this.state.username);
                        this.context.router.replace('/app/travelsearch')
                    })
                }.bind(this),
                error: (response) => {
                    if (response.status === 400) {
                        this.setState({'errors': response.responseJSON})
                    }
                }
            })
        }
        else this.setState({errors: {password: 'field empty or passwords does not match'}})
    }


    handlePhoneChange(value) {
        this.setState({
           phonenumber: value
        });
     }

    render() {
        let errors = this.state.errors;
        let messages = (
            <div>
                {errors ? Object.keys(errors).map(function (key) {
                    return <div key={key}>{key}: {errors[key]}</div>;
                }) : null}
            </div>
        );
        return (
            <div  className="container">
                <h1>Sign Up</h1>
      
                <div className="panel panel-info profile_form_panel">
                    <div className="panel-body p25 ">
                        <div className="m0 pt25 row row-eq-height">
                            <div className="col-xs-7">
                                <form onSubmit={this.handleSubmit}>
                                    <div className='form-group'>
                                        <div>{messages}</div>
                                        <FormInput  type='text'
                                                   placeholder='user name' required 
                                                   onChange={(e) => (this.setState({username: e.target.value}))}/>
                                        {/*
                                        <FormInput  type='text'
                                                   placeholder='first name' required
                                                   onChange={(e) => (this.setState({firstName: e.target.value}))}/>
                                        <FormInput type='text' placeholder='last name'
                                                   onChange={(e) => (this.setState({lastName: e.target.value}))}/>
                                        */}
                                        <FormInput  type='email' placeholder='email' required
                                                   onChange={(e) => (this.setState({email: e.target.value}))}/>

                                        <FormInput type='text' placeholder='phone number' required 
                                                   onChange={(e) => (this.setState({phonenumber: e.target.value}))}/>
                                        <FormInput  type='password'
                                                   placeholder='password'
                                                   onChange={(e) => (this.setState({password: e.target.value}))}/>
                                        <FormInput  type='password'
                                                   placeholder='confirm password'
                                                   onChange={(e) => (this.setState({passwordConfirm: e.target.value}))}/>
                                        <div className="panel-footer clearfix">
                                            <input className="pull-right btn update_button" type="submit"/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Signup.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Signup