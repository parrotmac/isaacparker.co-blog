import React, {Component} from 'react'
import "./styles/BlogPost.css"

class BlogPost extends Component {

    componentDidMount() {
        this.blogPostBody.innerHTML = this.props.blogPost.Body
    }

    componentWillReceiveProps(nextProps) {
        this.blogPostBody.innerHTML = nextProps.blogPost.Body;
    }

    render() {
        const {ID, Title, User} = this.props.blogPost;
        return (
            <div className={'BlogPost'} key={ID}>
                <h3 className={'BlogPost-Title'}>{Title}</h3>
                <p className={'BlogPost-Author'}>UID: {User.ID}</p>
                <div ref={div => this.blogPostBody = div}>

                </div>
            </div>
        )
    }
}

export default BlogPost
