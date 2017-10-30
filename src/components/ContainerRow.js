import React, {Component} from 'react'
import Row from "./Row";

class ContainerRow extends Component {
    render() {
        return (
            <div className={'container'}>
                <Row>
                    {this.props.children}
                </Row>
            </div>
        )
    }
}

export default ContainerRow
