import React, {Component} from 'react'
import './styles/Nav.css'
import {NavLink} from "react-router-dom";

class Nav extends Component {
    render() {
        return (
            <nav>
                <NavLink activeClassName={'active'} to="/blog">Blog</NavLink>
                <NavLink activeClassName={'active'} to="/portfolio">Portfolio</NavLink>
                <NavLink activeClassName={'active'} to="/social">Social</NavLink>
                <NavLink activeClassName={'active'} to="/contact">Contact</NavLink>
                {/*<NavLink activeClassName={'active'} to="#search">*/}
                    {/*<i className="search-icon material-icons">search</i>*/}
                {/*</NavLink>*/}
            </nav>
        )
    }
}

export default Nav
