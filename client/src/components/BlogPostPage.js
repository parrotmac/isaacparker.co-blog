import React, {Component} from 'react'
import {inject, observer} from "mobx-react";
import AdminOnly from "./Admin/AdminOnly";
import Toolbar from "./Admin/Toolbar";
import HorizontalRule from "./HorizontalRule";
import {Link, Redirect} from "react-router-dom";
import ModestCommentsSection from "./ModestCommentsSection";
import {BLOG_POST_REQUEST_STATES} from "../stores/BlogPost";
import FileUploader from "../containers/FileUploader";
import RichTextEditor from "./RichTextEditor";
import BlogPost from "./BlogPost";

@inject("blogPostStore") @observer
class BlogPostPage extends Component {

    constructor(props) {
        super(props);

        this.deleteClicked = this.deleteClicked.bind(this);
        this.updateClicked = this.updateClicked.bind(this);
        this.onTitleChanged = this.onTitleChanged.bind(this);
        this.onEditorChangedValue = this.onEditorChangedValue.bind(this);

        const {blogPostId} = this.props.match.params;
        const {blogPosts} = this.props.blogPostStore;

        let shouldCreateNewPost = false;
        const {path} = this.props.match;
        if (path === "/blog/new") { // TODO: Determine if there's a more elegant solution
            // Should create a new blog post
            shouldCreateNewPost = true;
        } else {
            this.currentBlogPost = blogPosts.find(blogPost => blogPost.ID === parseInt(blogPostId, 10));
        }


        this.state = {
            blogPostId: blogPostId,
            wasDeleted: false,
            isUpdating: false
        };
    }


    componentWillReact() {
        const {blogPostId} = this.props.match.params;
        const {blogPosts, isUpdating} = this.props.blogPostStore;

        this.currentBlogPost = blogPosts.find(blogPost => blogPost.ID === parseInt(blogPostId, 10));

        const newState = {
            isUpdating: isUpdating,
        };

        this.setState(newState);
    }


    deleteClicked(event) {
        if(window.confirm("Are you sure you want to delete this resource?")) {
            this.props.blogPostStore.deleteBlogPost(this.currentBlogPost).then(
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
        this.props.blogPostStore.saveBlogPost(this.currentBlogPost);
    }

    onEditorChangedValue(newValue) {
        this.currentBlogPost.body = newValue;
    }

    onTitleChanged(event) {
        this.currentBlogPost.title = event.target.value;
    }

    render() {
        const {status} = this.props.blogPostStore;

        if(this.state.wasDeleted) {
            return (
                <Redirect to={'/blog'} />
            )
        }

        if(status === BLOG_POST_REQUEST_STATES.REQUESTING) {
            return <small>Loading...</small>
        }

        const isUpdating = status === BLOG_POST_REQUEST_STATES.UPDATING;
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

        if(status === BLOG_POST_REQUEST_STATES.FAILURE) {
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

        if(typeof this.currentBlogPost === 'undefined') {

            // this.currentBlogPost = this.props.blogPostStore.createBlogPost();

            return (
                <div>
                    <AdminOnly>
                        <Toolbar>
                            {toolbarItems.newPost}
                        </Toolbar>
                    </AdminOnly>
                    <small>This post doesn't seem to exist!</small>
                </div>
            )
        }

        return (
            <div>
                <AdminOnly>
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
                            <input className="form-control" type={'text'} value={this.currentBlogPost.title} onChange={this.onTitleChanged} />
                        </div>
                        <label>Published:
                            <input type={'checkbox'} checked={this.currentBlogPost.isPublished} onChange={event => this.currentBlogPost.isPublished = event.target.checked}/>
                        </label>
                        <RichTextEditor onChange={this.onEditorChangedValue} value={this.currentBlogPost.body} />
                    </details>
                    <HorizontalRule vMargin={20} hMargin={50} />
                </AdminOnly>
                <BlogPost blogPost={this.currentBlogPost}/>
                <HorizontalRule/>
                <ModestCommentsSection pageTitle={this.currentBlogPost.title} pageId={`blog-post-${this.currentBlogPost.ID}`} fullUrl={window.location.href}/>
            </div>
        )
    }
}

export default BlogPostPage
