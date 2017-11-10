import React, {Component} from 'react'
import {NavLink} from "react-router-dom";
import {inject, observer} from "mobx-react";
import './styles/Portfolio.css';

@inject("authStore") @inject("portfolioStore") @observer
class Portfolio extends Component {
    render() {

        if(this.props.authStore.userIsSignedIn) {
            return(
                    <div className={'PortfolioLinks'}>
                        {this.props.portfolioStore.projects.map((project, index) =>
                            <NavLink activeClassName={'active'} to={`/portfolio/${project.slug}`}>
                                {project.clientName}
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
