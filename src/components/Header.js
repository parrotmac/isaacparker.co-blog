import React, {Component} from 'react'
import Nav from "./Nav";
import './styles/Header.css'

class Header extends Component {
    render() {
        return (
            <header>
                <div className="header-inner">
                    <a href="/" className="logo">isaacparker.co</a>
                    <Nav />
                </div>
            </header>
        )
    }
}

export default Header
