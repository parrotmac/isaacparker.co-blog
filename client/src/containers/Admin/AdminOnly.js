import {Component} from 'react'
import {inject, observer} from "mobx-react";

@inject("authStore") @observer
class AdminOnly extends Component {
    render() {
        const isAdmin = this.props.authStore.isAdminUser;

        if(isAdmin) {
            return this.props.children
        }
        return null
    }
}

export default AdminOnly
