import React, {Component} from 'react'
import './styles/Nav.css'

class Nav extends Component {
    render() {
        return (
            <nav>
                <a href="/blog">Blog</a>
                <a href="/portfolio">Portfolio</a>
                <a href="/social">Social</a>
                <a href="/contact">Contact</a>
                <a href="#search">
                    <i className="search-icon material-icons">search</i>
                </a>
            </nav>
        )
    }
}

export default Nav
