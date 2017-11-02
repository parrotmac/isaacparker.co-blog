import React, {Component} from 'react'
import './styles/PortfolioSnippet.css';

class PortfolioSnippet extends Component {
    render() {
        return (
            <div className={'PortfolioSnippet'}>
                <img className={'Snippet-CoverImage'} alt={''} src={this.props.project.coverImageURL} />
                <p className={'Snippet-ClientName'}>{this.props.project.clientName}</p>
            </div>
        )
    }
}

export default PortfolioSnippet
