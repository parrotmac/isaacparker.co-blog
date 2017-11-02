import React, {Component} from 'react'
import EditorPane from "./EditorPane";

class NewBlogPost extends Component {
    render() {
        return (
            <div>
                <h3>Start a new post</h3>
                <input type={'text'} size={'40'} style={{fontSize: 24, marginBottom: 5}} placeholder={'Post Title'}/>
                <EditorPane onChange={console.log} />
                <br/>
                <button className={'btn btn-primary'}>Save</button>
            </div>
        )
    }
}

export default NewBlogPost
