import React, {Component} from 'react'

class FileList extends Component {
    render() {

        return (

            <ul style={{listStyleType: "none", padding: 0}}>
                {this.props.files.map(
                    file =>
                        <li style={{margin: '5px 0'}}>
                            <p><strong>Name:</strong> {file.name}</p>
                            <p>
                                <strong>URL:</strong>
                                <a href={file.url} target={'_blank'}>
                                    <pre style={{display: 'inline'}}>{file.url}</pre>
                                </a>
                            </p>
                        </li>)
                }
            </ul>
        )
    }
}

export default FileList