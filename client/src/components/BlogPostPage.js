import React, {Component} from 'react'
import BlogPost from "./BlogPost";
import {inject, observer} from "mobx-react";
import AdminOnly from "./Admin/AdminOnly";
import Toolbar from "./Admin/Toolbar";
import EditorPane from "./EditorPane";
import HorizontalRule from "./HorizontalRule";
import {Link, Redirect} from "react-router-dom";
import ModestCommentsSection from "./ModestCommentsSection";

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
        this.currentBlogPost = blogPosts.find(blogPost => blogPost.ID === parseInt(blogPostId, 10));

        this.state = {
            blogPostId: blogPostId,
            wasDeleted: false
        };


    }

    componentWillReact() {

        const {blogPostId} = this.props.match.params;
        const {blogPosts} = this.props.blogPostStore;
        this.currentBlogPost = blogPosts.find(blogPost => blogPost.ID === parseInt(blogPostId, 10));
    }


    deleteClicked(event) {
        if(window.confirm("Delete this 4 realz?")) {
            this.props.blogPostStore.deleteBlogPost(this.currentBlogPost).then(
                didDelete => {
                    // Settings `wasDeleted` to result of call. This way we can redirect to the main page after deletion
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
        const {isLoading, loadFailed} = this.props.blogPostStore;

        if(this.state.wasDeleted) {
            return (
                <Redirect to={'/blog'} />
            )
        }

        if(isLoading) {
            return <small>Loading...</small>
        }

        const toolbarItems = {
            deletePost: <button onClick={this.deleteClicked} className={'btn btn-danger'}>
                Delete <span className={'glyphicon glyphicon-trash'}/>
            </button>,
            updatePost: <button onClick={this.updateClicked} className={'btn btn-primary'}>
                Update <span className={'glyphicon glyphicon-upload'}/>
            </button>,

            newPost: <Link className={'btn btn-primary'} to={'/blog/new'}>
                New <span className={'glyphicon glyphicon-plus'}/>
            </Link>
        };


        if(loadFailed) {
            return (
                <div>
                    <Toolbar>
                    {toolbarItems.deletePost}
                    {toolbarItems.newPost}
                    </Toolbar>
                    <small>There was an issue loading this blog post.</small>
                </div>
            )
        }


        if(typeof this.currentBlogPost === 'undefined') {
            return (
                <div>
                    <Toolbar>
                        {toolbarItems.newPost}
                    </Toolbar>
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
                    <details style={{backgroundColor: "#C0C0C0"}}>
                        <summary style={{padding: 10}}>Edit Blog Post</summary>
                        <input type={'text'} value={this.currentBlogPost.title} onChange={this.onTitleChanged} />
                        <EditorPane onChange={this.onEditorChangedValue} initialValue={this.currentBlogPost.body}/>
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