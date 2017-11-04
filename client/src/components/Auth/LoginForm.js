import React, {Component} from 'react'
import {inject, observer} from "mobx-react";

@inject("Authentication") @observer
class LoginForm extends Component {

    handleFormSubmit(event) {
        event.preventDefault();
        this.props.Authentication.requestJsonWebToken(this.emailInput.value, this.passwordInput.value);
    }

    render() {
        return (
            <form onSubmit={this.handleFormSubmit.bind(this)}>
                <div className="form-group">
                    <label>Email address
                        <input ref={input => this.emailInput = input} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                    </label>
                </div>
                <div className="form-group">
                    <label>Password
                        <input ref={input => this.passwordInput = input} type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        )
    }
}

export default LoginForm
