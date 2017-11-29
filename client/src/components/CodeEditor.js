import React, {Component} from 'react'
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/twilight';

class CodeEditor extends Component {
    constructor(props) {
        super(props);

        this.onLoad = this.onLoad.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onLoad(editor) {
        // Editor loaded
    }

    onChange(value, event) {
        this.props.onChange(value);
    }

    render() {
        const {initialValue, onChange} = this.props;

        if (typeof initialValue === 'undefined') {
            return null
        }

        return (
            <AceEditor
                mode="html"
                theme="twilight"
                name='brace-editor'
                onLoad={this.onLoad}
                onChange={this.onChange}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={initialValue}
                width={'100%'}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                }}/>
        )
    }
}

export default CodeEditor