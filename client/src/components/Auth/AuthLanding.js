import React, {Component} from 'react'
import './styles/AuthLanding.css';
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import {inject, observer} from "mobx-react";

@inject("authStore") @observer
class AuthLanding extends Component {
    render() {
        if(this.props.authStore.userIsSignedIn) {
            return (
                <div>
                    <div className={'col-sm-4 col-sm-offset-4'}>
                        <h2>Welcome, human</h2>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div className={'col-sm-4 col-sm-offset-2 AuthLanding-Split'}>
                        <h3>Login</h3>
                        <LoginForm/>
                    </div>
                    <div className={'col-sm-4 AuthLanding-Split'}>
                        <h3>Register</h3>
                        <RegisterForm/>
                    </div>
                </div>
            )
        }
    }
}

export default AuthLanding
