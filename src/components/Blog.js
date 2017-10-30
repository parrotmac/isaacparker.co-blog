import React, {Component} from 'react'
import BlogPost from "./BlogPost";

class Blog extends Component {
    state = {
        posts: []
    };

    componentDidMount() {
        fetch(
            '/api/posts'
        ).then(
            res => res.json()
        ).then(
            res => {
                this.setState({
                    posts: res
                })
            }
        );
    }

    render() {
        if(this.state.posts.length === 0) {
            return (<small>Posts will appear here</small>)
        }
        return (
            <div>
                {this.state.posts.map(post =>
                    <BlogPost blogPost={post}/>
                )}
            </div>
        )
    }
}

export default Blog
