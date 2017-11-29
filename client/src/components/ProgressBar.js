import React, {Component} from 'react'

class ProgressBar extends Component {
    render() {
        const {progress, outOf=100} = this.props;

        const normalizedProgress = parseInt( progress / outOf * 100 );

        return (
            <div className="progress">
                <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow={normalizedProgress} aria-valuemin="0" aria-valuemax="100" style={{width: `${normalizedProgress}%`}}>
                    <span className="sr-only">{normalizedProgress}% Complete</span>
                </div>
            </div>
        )
    }
}

export default ProgressBar
