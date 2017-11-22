import React, {Component} from 'react'
import {inject, observer} from "mobx-react";

@inject("authStore") @observer
class AuthInitializer extends Component {
    constructor(props) {
        super(props);
    }
    render() {

        // Triggers a call during application boot to ensure JWT status is up to date
        this.props.authStore.userIsSignedIn;

        return null
    }
}

export default AuthInitializer
