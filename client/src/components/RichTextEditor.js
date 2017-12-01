import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css';

import 'bootstrap/js/modal';
import 'bootstrap/js/dropdown';
import 'bootstrap/js/tooltip';
import 'bootstrap/dist/css/bootstrap.css';

class RichTextEditor extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    // noinspection JSUnusedGlobalSymbols
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired
    };

    onChange(content) {
        const {onChange} = this.props;
        onChange(content);
    }

    render() {

        const {value} = this.props;

        return (
            <ReactSummernote
                value={value}
                options={{
                    lang: 'en-US',
                    height: 450,
                    dialogsInBody: true,
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'underline', 'clear']],
                        ['fontname', ['fontname']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture', 'video']],
                        ['view', ['fullscreen', 'codeview']]
                    ]
                }}
                onChange={this.onChange}
            />
        );
    }
}

export default RichTextEditor;
