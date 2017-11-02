import React, {Component} from 'react'
import './styles/Main.css'

class Main extends Component {
    render() {
        return (
            <main>{this.props.children}</main>
        )
    }
}

export default Main
