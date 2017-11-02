import React, {Component} from 'react'
import Nav from "./Nav";
import './styles/Header.css'
import {Link} from "react-router-dom";

class Header extends Component {
    render() {
        return (
            <header>
                <div className="header-inner">
                    <Link to="/" className="logo">isaacparker.co</Link>
                    <Nav />
                </div>
            </header>
        )
    }
}

export default Header
