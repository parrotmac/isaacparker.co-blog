import React, {Component} from 'react';
import RichTextEditor from 'react-rte';
import PropTypes from 'prop-types';

class EditorPane extends Component {
    // noinspection JSUnusedGlobalSymbols
    static propTypes = {
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);

        let initialValue;
        if(typeof this.props.initialValue !== 'undefined') {
            initialValue = RichTextEditor.createValueFromString(this.props.initialValue, 'html');
        } else {
            initialValue = RichTextEditor.createEmptyValue();
        }

        this.state = {
            value: initialValue
        };

    }

    componentWillReceiveProps(nextProps) {
        const {initialValue} = nextProps;
        this.setState({
            value: RichTextEditor.createValueFromString(initialValue, 'html')
        })
    }

    onChange = (value) => {
        this.setState({value});
        if (this.props.onChange) {
            // Send the changes up to the parent component as an HTML string.
            // This is here to demonstrate using `.toString()` but in a real app it
            // would be better to avoid generating a string on each change.
            this.props.onChange(
                value.toString('html')
            );
        }
    };

    render() {
        return (
            <RichTextEditor
                value={this.state.value}
                onChange={this.onChange.bind(this)}
            />
        )
    }
}

export default EditorPane
