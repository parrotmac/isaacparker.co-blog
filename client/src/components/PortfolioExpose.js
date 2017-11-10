import React, {Component} from 'react'
import {inject, observer} from "mobx-react";
import './styles/PortfolioExpose.css'

@inject("portfolioStore") @observer
class PortfolioExpose extends Component {
    state = {
        currentProject: undefined
    };

    componentDidMount() {
        this.setState({
            currentProject: this.props.portfolioStore.projects.find(project => project.slug === this.props.match.params.projectSlug)
        }, () => {
            this.writeupContainer.innerHTML = this.state.currentProject.writeupBody;
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            currentProject: this.props.portfolioStore.projects.find(project => project.slug === nextProps.match.params.projectSlug)
        }, () => {
            this.writeupContainer.innerHTML = this.state.currentProject.writeupBody;
        });
    }

    render() {

        if(typeof this.state.currentProject === 'undefined') {
            return (
                <div>
                    <p>This project either doesn't exist, or details aren't available right now.</p>
                </div>
            )
        }

        return (
            <div className={'PortfolioExpose'}>
                <div ref={div => this.writeupContainer = div}></div>
            </div>
        )
    }
}

export default PortfolioExpose
