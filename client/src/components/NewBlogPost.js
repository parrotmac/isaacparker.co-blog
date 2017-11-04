import React, {Component} from 'react'
import EditorPane from "./EditorPane";
import {inject, observer} from "mobx-react";

@inject("BlogPost") @observer
class NewBlogPost extends Component {
    state = {
        blogPostBody: ""
    };

    onSavePost() {
        this.props.BlogPost.uploadBlogPost(this.state.blogPostBody);
    }

    render() {
        return (
            <div>
                <h3>Start a new post</h3>
                <input type={'text'} size={'40'} style={{fontSize: 24, marginBottom: 5}} placeholder={'Post Title'}/>
                <EditorPane onChange={currentBody => this.setState({blogPostBody: currentBody})} />
                <br/>
                <button className={'btn btn-primary'} onClick={this.onSavePost.bind(this)}>Save</button>
            </div>
        )
    }
}

export default NewBlogPost
