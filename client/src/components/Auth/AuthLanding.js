import React, {Component} from 'react'
import ContainerRow from "../ContainerRow";
import './styles/AuthLanding.css';
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import {inject, observer} from "mobx-react";

@inject("Authentication") @observer
class AuthLanding extends Component {
    render() {
        return (
            <ContainerRow>
                <div className={'col-sm-4 col-sm-offset-2 AuthLanding-Split'}>
                    <h3>Login</h3>
                    <LoginForm/>
                </div>
                <div className={'col-sm-4 AuthLanding-Split'}>
                    <h3>Register</h3>
                    <RegisterForm/>
                </div>
                <pre>{this.props.Authentication.jsonWebToken}</pre>
            </ContainerRow>
        )
    }
}

export default AuthLanding
