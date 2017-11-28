import {Component} from 'react'
import {inject, observer} from "mobx-react";

@inject("authStore") @observer
class AuthInitializer extends Component {
    render() {
        // Triggers a call during application boot to ensure JWT status is up to date
        // Must be inside something that reacts, so componentDidMount won't work

        // eslint-disable-next-line
        this.props.authStore.userIsSignedIn;

        return null
    }
}

export default AuthInitializer
