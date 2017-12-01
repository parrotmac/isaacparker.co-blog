import React, {Component} from 'react'

class FileList extends Component {
    render() {

        let fileKeyId = 0;

        return (

            <ul style={{listStyleType: "none", padding: 0}}>
                {this.props.files.map(
                    file =>
                        <li key={`${file.name}-file-${fileKeyId++}`} style={{margin: '15px 0'}}>
                            <p><strong>Name:</strong> {file.name}</p>
                            <div>
                                <strong>URL:</strong>
                                <a href={window.encodeURI(file.url)} target={'_blank'}>
                                    <pre style={{display: 'inline'}}>{window.encodeURI(file.url)}</pre>
                                </a>
                            </div>
                        </li>)
                }
            </ul>
        )
    }
}

export default FileList