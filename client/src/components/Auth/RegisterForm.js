import React, {Component} from 'react'

class RegisterForm extends Component {
    constructor(props) {
        super(props)

        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }

    handleFormSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleFormSubmit}>
                <div className="form-group">
                    <label>Email address
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                    </label>
                </div>

                <div className="form-group">
                    <label>First Name
                        <input type="text" className="form-control" placeholder="First Name" />
                    </label>
                </div>

                <div className="form-group">
                    <label>Last Name
                        <input type="text" className="form-control" placeholder="Last Name" />
                    </label>
                </div>

                <div className="form-group">
                    <label>Password
                        <input type="password" className="form-control" placeholder="Password" />
                    </label>
                </div>
                <div className="form-group">
                    <label>Password
                        <input type="password" className="form-control" placeholder="Password" />
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        )
    }
}

export default RegisterForm
