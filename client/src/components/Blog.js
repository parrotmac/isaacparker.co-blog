import React, {Component} from 'react'
import BlogPost from "./BlogPost";
import {inject, observer} from "mobx-react";
import {BLOG_POST_REQUEST_STATES} from "../stores/BlogPost";
import HorizontalRule from "./HorizontalRule";

@inject("BlogPost") @observer
class Blog extends Component {

    componentDidMount() {
        this.props.BlogPost.fetchBlogPosts();
    }

    render() {
        const {blogPosts, fetchState} = this.props.BlogPost;

        if(fetchState === BLOG_POST_REQUEST_STATES.REQUESTING || fetchState === BLOG_POST_REQUEST_STATES.INITIAL) {
            return (<small>Loading...</small>)
        }

        if(fetchState === BLOG_POST_REQUEST_STATES.FAILURE) {
            return (<small>:( Unable to get blog posts.</small>)
        }


        if(BLOG_POST_REQUEST_STATES.SUCCESS && blogPosts.length === 0) {
            return (<small>There aren't any blog posts yet.</small>)
        }

        return (
            blogPosts.map((post, index) =>
                <div>

                    <BlogPost key={index} blogPost={post}/>

                    {index !== blogPosts.length - 1 &&
                        <HorizontalRule key={`hr-${index}`} width={'80%'} hMargin={'auto'} vMargin={50}/>
                    }
                </div>
            )
        )
    }
}

export default Blog
