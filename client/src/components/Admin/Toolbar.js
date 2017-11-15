import React, {Component} from 'react'
import './styles/Toolbar.css'

class Toolbar extends Component {
    render() {
        return (
            <div className={'Toolbar'}>
                {this.props.children}
            </div>
        )
    }
}

export default Toolbar