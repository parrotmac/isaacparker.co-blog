import React, {Component} from 'react'
import {inject, observer, propTypes as PropTypes} from "mobx-react";
import AdminOnly from "./AdminOnly";
import Toolbar from "../../components/Admin/Toolbar";
import {Link, Redirect} from "react-router-dom";
import {BLOG_POST_REQUEST_STATES} from "../../stores/BlogPost";
import FileUploader from "./FileUploader";
import RichTextEditor from "../../components/RichTextEditor";

@inject("blogPostStore") @observer
class BlogPostEditor extends Component {
    // noinspection JSUnusedGlobalSymbols
    static propTypes = {
        blogPost: PropTypes.objectOrObservableObject.isRequired,
        blogPostStore : PropTypes.objectOrObservableObject.isRequired
    };

    constructor(props) {
        super(props);

        this.deleteClicked = this.deleteClicked.bind(this);
        this.updateClicked = this.updateClicked.bind(this);
        this.onTitleChanged = this.onTitleChanged.bind(this);
        this.onEditorChangedValue = this.onEditorChangedValue.bind(this);

        this.state = {
            wasDeleted: false,
            isUpdating: false
        };
    }

    deleteClicked(event) {
        if(window.confirm("Are you sure you want to delete this resource?")) {
            this.props.blogPostStore.deleteBlogPost(this.props.blogPost).then(
                didDelete => {
                    // Setting `wasDeleted` to result of call. This way we can redirect to the main page after deletion
                    this.setState({
                        wasDeleted: didDelete
                    })
                }
            );
        }
    }

    updateClicked(event) {
        this.props.blogPostStore.saveBlogPost(this.props.blogPost);
    }

    onEditorChangedValue(newValue) {
        this.props.blogPost.body = newValue;
    }

    onTitleChanged(event) {
        this.props.blogPost.title = event.target.value;
    }

    render() {
        const {blogPost, blogPostStore} = this.props;

        if(this.state.wasDeleted) {
            return (
                <Redirect to={'/blog'} />
            )
        }

        const isUpdating = blogPostStore.status === BLOG_POST_REQUEST_STATES.UPDATING;
        let updateButtonText = "Update";
        if(isUpdating) {
            updateButtonText = "Updating...";
        }

        const toolbarItems = {
            deletePost: <button onClick={this.deleteClicked} className={'btn btn-danger'}>
                Delete <span className={'glyphicon glyphicon-trash'}/>
            </button>,
            updatePost: <button disabled={isUpdating} onClick={this.updateClicked} className={'btn btn-primary'}>
                {updateButtonText} <span className={'glyphicon glyphicon-upload'}/>
            </button>,
            newPost: <Link className={'btn btn-primary'} to={'/blog/new'}>
                New <span className={'glyphicon glyphicon-plus'}/>
            </Link>,
        };

        if(blogPostStore.status === BLOG_POST_REQUEST_STATES.FAILURE) {
            return (
                <div>
                    <AdminOnly>
                        <Toolbar>
                            {toolbarItems.deletePost}
                            {toolbarItems.newPost}
                        </Toolbar>
                    </AdminOnly>
                    <small>There was an issue loading this blog post.</small>
                </div>
            )
        }

        return (
            <div>
                <Toolbar>
                    {toolbarItems.deletePost}
                    {toolbarItems.updatePost}
                    {toolbarItems.newPost}
                </Toolbar>
                <Toolbar>
                    <FileUploader />
                </Toolbar>
                <details style={{backgroundColor: "#C0C0C0"}}>
                    <summary style={{padding: 10}}>Edit Blog Post</summary>
                    <div className="form-group">
                        <label>Title</label>
                        <input className="form-control" type={'text'} value={this.props.blogPost.title} onChange={this.onTitleChanged} />
                    </div>
                    <label>Published:
                        <input type={'checkbox'} checked={blogPost.isPublished} onChange={event => blogPost.isPublished = event.target.checked}/>
                    </label>
                    <RichTextEditor onChange={this.onEditorChangedValue} value={blogPost.body} />
                </details>
            </div>
        )
    }
}

export default BlogPostEditor
