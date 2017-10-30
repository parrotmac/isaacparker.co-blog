import React, { Component } from 'react';
import './App.css';
import EditorPane from "./EditorPane";

class App extends Component {

    state = {
        status: undefined,
        users: [],
        posts: []
    };

    constructor(props) {
        super(props);
        window.state = this.state;
    }

    componentDidMount() {
        // fetch(
        //     '/api/'
        // ).then(
        //     res => res.json()
        // ).then(
        //     res => {
        //         this.setState({
        //             status: res.status
        //         })
        //     }
        // );

        fetch(
            '/api/users'
        ).then(
            res => res.json()
        ).then(
            res => {
                if(typeof res.users !== 'undefined') {
                    this.setState({
                        users: res.users
                    })
                }
            }
        );

        fetch(
            '/api/posts'
        ).then(
            res => res.json()
        ).then(
            res => {
                this.setState({
                    posts: res
                })
            }
        );

    }



    render() {
        let statusString;
        if(this.state.status === 'ok') {
            statusString = `{ name: "Isaac Parkerh" }`;
        } else {
            statusString = `{ status: ${this.state.status} }`;
        }
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">{statusString}</h1>
                </header>
                <main className="App-intro">
                    <h3>Users</h3>
                    <ul>
                        {this.state.users.map(user => <li>{user.firstName} {user.lastName}{(user.isSuperuser)?" [Admin]":""}</li>)}
                    </ul>
                    <h3>Posts</h3>
                    {this.state.posts.length === 0?
                        <small>Posts will appear here</small>
                        :
                        <ul>
                            {this.state.posts.map(post => <li>{JSON.stringify(post)}</li>)}
                        </ul>
                    }
                </main>
                <div>
                    <EditorPane onChange={htmlBody => console.log("htmlBody", htmlBody)} />
                </div>
            </div>
        );
    }
}

export default App;
