import React, {Component} from 'react'
import FileUploadHelper from '../../utils/FileUploadHelper';
import {inject, observer} from "mobx-react";
import FileList from "../../components/FileList";
import ProgressBar from "../../components/ProgressBar";

@inject ("authStore") @observer
class FileUploader extends Component {
    constructor(props) {
        super(props);

        this.onFileChanged = this.onFileChanged.bind(this);
        this.onUploadClicked = this.onUploadClicked.bind(this);
        this.uploadFile = this.uploadFile.bind(this);

        this.fileUploadHelper = new FileUploadHelper("/api/media");
    }

    UPLOAD_BUTTON_STATES = {
        INITIAL: {
            label: 'Select Files',
            disabled: true,
            styles: {},
            glyphicon: 'glyphicon glyphicon-cloud-upload'
        },
        READY: {
            label: 'Upload Now',
            disabled: false,
            styles: {},
            glyphicon: 'glyphicon glyphicon-cloud-upload'
        },
        UPLOADING: {
            label: 'Uploading',
            disabled: true,
            styles: {},
            glyphicon: 'glyphicon glyphicon-refresh'
        }
    };

    state = {
        uploadButtonState: this.UPLOAD_BUTTON_STATES.INITIAL,
        uploadedFiles: [],
        allFiles: [],
        queuedFileCount: 0,
        processedFiles: 0,
        uploadHasBeenTriggered: false
    };

    componentDidMount() {
        this.fileUploadHelper.getFiles(
            this.props.authStore.jsonWebToken
        ).then(
            res => {
                this.setState({
                    allFiles: res
                })
            }
        )
    }

    onFileChanged(event) {
        const {files} = event.target;

        if(files.length > 0) {
            this.setState({
                uploadButtonState: this.UPLOAD_BUTTON_STATES.READY,
            });
        } else {
            this.setState({
                uploadButtonState: this.UPLOAD_BUTTON_STATES.INITIAL,
            });
        }
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

        const _uploadProcessed = () => {
            this.setState({
                processedFiles: this.state.processedFiles + 1
            }, () => {
                if (this.state.processedFiles === files.length) {
                    this.fileInput.value = "";
                    this.setState({
                        uploadButtonState: this.UPLOAD_BUTTON_STATES.INITIAL,
                    });
                }
            });
        };

        this.setState({
            uploadButtonState: this.UPLOAD_BUTTON_STATES.UPLOADING,
            queuedFileCount: files.length,
            uploadHasBeenTriggered: true,
            processedFiles: 0
        }, () => {

            // Once everything is ready...
            for(let i = 0; i < files.length; i++) {
                this.uploadFile(files[i], _uploadProcessed)
            }

        });
    }


    render() {

        const getUploadBtn = () => {
            const {label, disabled, styles, glyphicon } = this.state.uploadButtonState;
            return (
                <button className={'btn btn-primary'} disabled={disabled} style={styles} onClick={this.onUploadClicked}>
                    {label}
                    &nbsp;
                    <span className={glyphicon} />
                </button>
            )
        };

        const {queuedFileCount, processedFiles} = this.state;

        return (
            <div>
                <input type={'file'} ref={input => this.fileInput = input} multiple={true} onChange={this.onFileChanged} />
                {getUploadBtn()}

                {this.state.uploadHasBeenTriggered &&
                <div>
                    {queuedFileCount === 1 ?
                        <span>Uploaded 1 file</span>
                        :
                        <span>Uploaded {processedFiles} of {queuedFileCount} files</span>
                    }
                    {processedFiles !== queuedFileCount &&
                        <ProgressBar progress={processedFiles} outOf={queuedFileCount}/>
                    }
                </div>
                }

                <details>
                    <summary>New Uploads</summary>
                    <FileList files={this.state.uploadedFiles} />
                </details>
                <details>
                    <summary>All Uploads</summary>
                    <FileList files={this.state.allFiles} />
                </details>
            </div>
        )
    }
}

export default FileUploader