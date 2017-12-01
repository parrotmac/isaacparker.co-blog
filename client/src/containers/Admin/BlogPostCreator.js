import React, {Component} from 'react'
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router-dom";

@inject("blogPostStore") @inject("authStore") @observer
class BlogPostCreator extends Component {
    /**
     * errorMsg: Message from an error
     * blogPostId: null on init, otherwise the integer ID of a newly created blog post
     * @type {{errorMsg: null, blogPostId: null}}
     */
    state = {
        errorMsg: null,
        blogPostId: null
    };

    /**
     * Called when 'Create' button clicked
     * If the 'title' input isn't blank it creates a new blog post, then updates the 'blogPostId' in the state
     * (Updating this value will make the `render()` method return a redirect to the new blog post on next render)
     */
    onCreateClicked() {
        const trimmedTitle = this.titleInput.value.trim();
        if(trimmedTitle !== "") {
            const newBlogPost = this.props.blogPostStore.createBlogPost();
            newBlogPost.title = trimmedTitle;
            newBlogPost.saveInstance().then(
                savedPost => {
                    this.setState({
                        blogPostId: savedPost.ID
                    });
                    console.log(savedPost);
                }
            ).catch( err => {
                this.setState({
                    errorMsg: err
                })
            });
        }
    }

    render() {

        // Extract blogPostId
        const {blogPostId} = this.state;

        // If `blogPostId` has been set, redirect to new blog post for editing
        if(blogPostId !== null) {
            return(
                <Redirect to={`/blog/${blogPostId}`} />
            )
        }

        // Remember, isAdminUser only affects display. It's up to the server to actually enforce authentication & authorization
        if(this.props.authStore.isAdminUser) {
            return (
                <div>
                    <h3>Create new blog post</h3>
                    <label style={{display: "block"}}>
                        Title:
                        &nbsp;
                        <input ref={input => this.titleInput = input}/>
                    </label>
                    <button onClick={this.onCreateClicked.bind(this)} className={'btn btn-primary'}>Create</button>
                </div>
            )
        } else if(this.props.authStore.isAdminUser === 0) {
            return (
                <h3>Loading...</h3>
            )
        }

        // Simply display error message if there was one
        if(this.state.errorMsg !== null) {
            return (
                <div>
                    <h3>Error:</h3>
                    <pre>{this.state.errorMsg}</pre>
                    <p>Please try again</p>
                </div>
            )
        }

        return (
            <div>
                <h3>Uh-oh! <small>You're not authorized to create blog posts</small></h3>
            </div>
        )
    }
}

export default BlogPostCreator