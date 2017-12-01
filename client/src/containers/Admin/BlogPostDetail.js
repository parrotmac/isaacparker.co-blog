import React, {Component} from 'react'
import AdminOnly from "./AdminOnly";
import BlogPostEditor from "./BlogPostEditor";
import BlogPostDisplay from "../../components/BlogPostDisplay";
import {inject, observer} from "mobx-react";
import HorizontalRule from "../../components/HorizontalRule";
import ModestCommentsSection from "../../components/ModestCommentsSection";
import {BLOG_POST_REQUEST_STATES} from "../../stores/BlogPost";
import PageNotFound from "../../components/PageNotFound";

@inject("blogPostStore") @observer
class BlogPostDetail extends Component {

    render() {
        const {blogPostId} = this.props.match.params;

        const {blogPostStore} = this.props;

        const {blogPosts} = blogPostStore;


        const currentBlogPost = blogPosts.find(blogPost => blogPost.ID === parseInt(blogPostId, 10));

        const shouldDisplayLoading = (
            blogPostStore.status === BLOG_POST_REQUEST_STATES.INITIAL ||
            blogPostStore.status === BLOG_POST_REQUEST_STATES.REQUESTING
        );

        const shouldDisplayContent = (
            (blogPostStore.status === BLOG_POST_REQUEST_STATES.SUCCESS && typeof currentBlogPost !== 'undefined')
            || blogPostStore.status === BLOG_POST_REQUEST_STATES.UPDATING
        );


        if(shouldDisplayLoading) {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            )
        }

        if(shouldDisplayContent) {
            return (
                <div>
                    <AdminOnly>
                        <BlogPostEditor blogPost={currentBlogPost} blogPostStore={blogPostStore}/>
                        <HorizontalRule/>
                    </AdminOnly>
                    <BlogPostDisplay blogPost={currentBlogPost}/>
                    <HorizontalRule/>
                    <ModestCommentsSection pageTitle={currentBlogPost.title} pageId={`blog-post-${currentBlogPost.ID}`}
                                           fullUrl={window.location.href}/>
                </div>
            )
        }

        return (
            <PageNotFound/>
        )
    }
}

export default BlogPostDetail
