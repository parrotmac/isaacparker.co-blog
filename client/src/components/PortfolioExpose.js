import React, {Component} from 'react'
import {inject, observer} from "mobx-react";

@inject("PortfolioProject") @observer
class PortfolioExpose extends Component {
    render() {
        return (
            <div>{this.props.PortfolioProject.projects.find(project => project.slug === this.props.match.params.projectSlug).clientName}</div>
        )
    }
}

export default PortfolioExpose
