import React, {Component} from 'react'
import FileUploadHelper from '../utils/FileUploadHelper';
import {inject, observer} from "mobx-react";

@inject ("authStore") @observer
class FileUploader extends Component {
    constructor(props) {
        super(props);

        this.onFileChanged = this.onFileChanged.bind(this);
        this.onUploadClicked = this.onUploadClicked.bind(this);
        this.uploadFile = this.uploadFile.bind(this);

        this.fileUploadHelper = new FileUploadHelper("/api/media");
    }

    state = {
        uploadBtnDisabled: true,
        uploadedFiles: []
    };

    onFileChanged(event) {
        const {files} = event.target;

        this.setState({
            uploadBtnDisabled: ! files.length > 0
        });
    }

    addFileToUploadedList(url, filename) {
        const newList = this.state.uploadedFiles;
        newList.push({
            url: url,
            name: filename,
        });
        this.setState({
            uploadedFiles: newList
        })
    }

    uploadFile(file, uploadProcessed) {

        const uploadForm = new FormData();
        uploadForm.append("file", file);

        this.fileUploadHelper.uploadFile(
            uploadForm,
            file.name,
            this.props.authStore.jsonWebToken
        ).then(
            res => {
                this.addFileToUploadedList(res.url, file.name);
                console.log("Uploaded", file.name, "to", res);
                uploadProcessed();
            }
        ).catch(
            err => {
                console.error("Unable to upload", file.name, err);
                uploadProcessed();
            }
        )
    }


    onUploadClicked() {
        const {files} = this.fileInput;

        let processedFiles = 0;

        const _uploadProcessed = () => {
            if(++processedFiles === files.length) {
                this.fileInput.value = "";
            }
        };

        for(let i = 0; i < files.length; i++) {
            this.uploadFile(files[i], _uploadProcessed)
        }
        this.setState({
            uploadBtnDisabled: true
        })
    }

    render() {

        const uploadedList = this.state.uploadedFiles.map(upload => <li>{upload.name}: <pre>{upload.url}</pre></li>);

        return (
            <div>
                <input type={'file'} ref={input => this.fileInput = input} multiple={true} onChange={this.onFileChanged} />
                <button className={'btn btn-primary'} disabled={this.state.uploadBtnDisabled} onClick={this.onUploadClicked}>Upload</button>
                <details>
                    <summary>New Uploads</summary>
                    <ul>{uploadedList}</ul>
                </details>
                <details>
                    <summary>All Uploads</summary>
                    <ul>
                        <li>(NYI)</li>
                    </ul>
                </details>
            </div>
        )
    }
}

export default FileUploader