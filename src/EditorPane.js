import React, {Component} from 'react';
import RichTextEditor from 'react-rte';
import PropTypes from 'prop-types';

class EditorPane extends Component {
    // noinspection JSUnusedGlobalSymbols
    static propTypes = {
        onChange: PropTypes.func
    };

    state = {
        value: RichTextEditor.createEmptyValue(),
    };

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
            <div>
                <h3>Start a new post</h3>
                <RichTextEditor
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                />
            </div>
        )
    }
}

export default EditorPane
