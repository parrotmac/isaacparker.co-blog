import React, {Component} from 'react'
import './styles/Main.css'

class Main extends Component {
    render() {
        return (
            <div className={'col-xs-12'}>
                <main>
                    {this.props.children}
                </main>
            </div>
        )
    }
}

export default Main
