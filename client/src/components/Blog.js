import React, {Component} from 'react'
import BlogPost from "./BlogPost";
import {inject, observer} from "mobx-react";
import HorizontalRule from "./HorizontalRule";
import AdminOnly from "./Admin/AdminOnly";
import Toolbar from "./Admin/Toolbar";
import {Link} from "react-router-dom";

@inject("blogPostStore") @observer
class Blog extends Component {

    render() {
        const {blogPosts, isLoading, loadFailed} = this.props.blogPostStore;

        if(isLoading) {
            return (<small>Loading...</small>)
        }

        if(loadFailed) {
            return (<small>:( Unable to get blog posts.</small>)
        }


        if(!isLoading && blogPosts.length === 0) {
            return (<small>There aren't any blog posts yet.</small>)
        }

        const posts = blogPosts.map((post, index) =>
            <div>
                <BlogPost key={index} blogPost={post} titleLink={`/blog/${post.ID}`} />

                {index !== blogPosts.length - 1 &&
                <HorizontalRule key={`hr-${index}`} width={'80%'} hMargin={'auto'} vMargin={50}/>
                }
            </div>
        );

        return (
            <div>
                <AdminOnly>
                    <Toolbar>
                        <Link className={'btn btn-primary'} to={'/blog/new'}>
                            New <span className={'glyphicon glyphicon-plus'}/>
                        </Link>
                    </Toolbar>
                </AdminOnly>
                {posts}
            </div>
        )
    }
}

export default Blog
