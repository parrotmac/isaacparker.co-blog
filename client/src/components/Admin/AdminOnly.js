import React, {Component} from 'react'
import {inject, observer} from "mobx-react";

@inject("authStore") @observer
class AdminOnly extends Component {
    render() {

        // TODO: Check for JWT claims
        const {jsonWebToken} = this.props.authStore;

        if(jsonWebToken === null) {
            return <none/>
        }
        return this.props.children
    }
}

export default AdminOnly
