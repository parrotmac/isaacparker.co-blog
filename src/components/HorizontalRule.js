import React, {Component} from 'react'
import styles from './styles/HorizontalRule.css';

class HorizontalRule extends Component {
    render() {
        const {hMargin, vMargin, width, color, weightPx} = this.props;

        const colorStr = color || styles.ipBlue || '#C0C0C0';

        const hrStyles = {
            marginLeft: hMargin || 10,
            marginRight: hMargin || 10,
            marginTop: vMargin || 10,
            marginBottom: vMargin || 10,
            borderTop: `${weightPx || 1}px solid ${colorStr}`,
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            width: width || "auto",
        };

        return (
            <hr style={hrStyles} />
        )
    }
}

export default HorizontalRule
