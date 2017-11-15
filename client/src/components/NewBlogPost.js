import React, {Component} from 'react'
import EditorPane from "./EditorPane";
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router-dom";

@inject("blogPostStore") @observer
class NewBlogPost extends Component {
    state = {
        blogPostBody: "",
        redirectId: null,
        shouldRedirect: false
    };

    onSavePost() {
        let newBlogPost = this.props.blogPostStore.createBlogPost();
        newBlogPost.updateFromJson({
            title: this.titleInput.value,
            body: this.state.blogPostBody,
            createdAt: new Date()
        });
        newBlogPost.saveInstance().then(
            savedBlogPost => {
                this.setState({
                    redirectId: savedBlogPost.ID,
                })
            }
        );
        window.newBlogPost = newBlogPost;
    }

    componentWillReact() {
        const createdBlogPost = this.props.blogPostStore.blogPosts.find(bp => bp.ID === this.state.redirectId);
        if(typeof createdBlogPost !== 'undefined') {
            this.setState({
                shouldRedirect: true
            })
        }
    }

    render() {

        if(this.state.shouldRedirect) {
            return (
                <Redirect to={`/blog/${this.state.redirectId}`} />
            )
        }

        return (
            <div>
                <h3>Start a new post</h3>
                <input type={'text'} size={'40'} ref={titleInput => this.titleInput = titleInput} style={{fontSize: 24, marginBottom: 5}} placeholder={'Post Title'}/>
                <EditorPane onChange={currentBody => this.setState({blogPostBody: currentBody})} />
                <br/>
                <button className={'btn btn-primary'} onClick={this.onSavePost.bind(this)}>Save</button>
            </div>
        )
    }
}

export default NewBlogPost
