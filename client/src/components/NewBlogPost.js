import React, {Component} from 'react'
import EditorPane from "./EditorPane";
import {inject, observer} from "mobx-react";

@inject("blogPostStore") @observer
class NewBlogPost extends Component {
    state = {
        blogPostBody: ""
    };

    onSavePost() {
        this.props.BlogPost.uploadBlogPost({
            title: this.titleInput.value,
            body: this.state.blogPostBody,
            isPublished: true
        });
    }

    render() {
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
