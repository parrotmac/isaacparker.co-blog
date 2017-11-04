import React, {Component} from 'react'
import styles from './styles/HorizontalRule.css';

class HorizontalRule extends Component {
    render() {
        const {hMargin, vMargin, width, color, weightPx} = this.props;

        const colorStr = color || styles.ipBlue || '#C0C0C0';

        const hrStyles = {
            marginLeft: typeof hMargin === 'undefined'? 10 : hMargin,
            marginRight: typeof hMargin === 'undefined'? 10 : hMargin,
            marginTop: typeof vMargin === 'undefined'? 10 : vMargin,
            marginBottom: typeof vMargin === 'undefined'? 10 : vMargin,
            borderTop: `${weightPx || 1}px solid ${colorStr}`,
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            width: typeof width === 'undefined' ? "auto" : width,
        };

        return (
            <hr style={hrStyles} />
        )
    }
}

export default HorizontalRule
