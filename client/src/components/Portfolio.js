import React, {Component} from 'react'
import PortfolioSnippet from "./PortfolioSnippet";
import {NavLink} from "react-router-dom";
import {inject, observer} from "mobx-react";
import './styles/Portfolio.css';

@inject("Authentication") @inject("PortfolioProject") @observer
class Portfolio extends Component {
    render() {

        if(this.props.Authentication.userIsSignedIn) {
            return(
                <div className={'PortfolioMain'}>
                    {this.props.PortfolioProject.projects.map((project, index) =>
                        <NavLink activeClassName={'active'} to={`/portfolio/${project.slug}`}>
                            <PortfolioSnippet project={project} />
                        </NavLink>)}
                </div>
            )
        }

        return (
            <h3>Coming Soon</h3>
        )
    }
}

export default Portfolio
