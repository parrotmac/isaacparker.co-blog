import React, {Component} from 'react'
import {inject, observer} from "mobx-react";
import NewBlogPost from "./NewBlogPost";

@inject("authStore") @observer
class AdminPage extends Component {
    render() {


        // TODO: Check if user is admin. Right now we don't look for JWT claims since I'm the only one in the DB, but in the future...
        if(! this.props.authStore.userIsSignedIn) {
            return(
                <div>
                    <strong>This page is only of admin users. If you're not an admin, it seems you're lost!</strong>
                </div>
            )
        }

        return (
            <div>
                <details>
                    <summary>New Blog Post</summary>
                    <NewBlogPost/>
                </details>
                <details>
                    <summary>New comments</summary>
                    <em>Not yet implemented</em>
                </details>
                <details>
                    <summary>Administrative Functions</summary>
                    <em>Coming soon!</em>
                </details>
            </div>
        )
    }
}

export default AdminPage
