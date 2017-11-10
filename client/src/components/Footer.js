import React, {Component} from 'react'
import './styles/Footer.css'

class Footer extends Component {
    render() {
        return (
            <div className="container container-full-width footer-container">
                <div className="row">
                    <div className="col">
                        <footer>
                            <p>
                                &copy; 2017 Isaac Parker
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer
