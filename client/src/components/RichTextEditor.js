import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css';

import 'bootstrap/js/modal';
import 'bootstrap/js/dropdown';
import 'bootstrap/js/tooltip';

// Shouldn't be needed as bootstrap is included globally
// import 'bootstrap/dist/css/bootstrap.css';

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
                    fontNames: [
                        'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New',
                        'Helvetica Neue', 'Helvetica', 'Impact', 'Lucida Grande',
                        'open-sans', 'Tahoma', 'Times New Roman', 'Verdana'
                    ],
                    defaultFontName: 'open-sans',
                    fontNamesIgnoreCheck: ['open-sans'],
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
