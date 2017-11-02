import React, {Component} from 'react'
import "./styles/BlogPost.css"

class BlogPost extends Component {
    componentDidMount() {
        this.blogPostBody.innerHTML = this.props.blogPost.body
    }

    componentWillReceiveProps(nextProps) {
        this.blogPostBody.innerHTML = nextProps.blogPost.body;
    }

    render() {
        const {ID, title, user, CreatedAt} = this.props.blogPost;
        const createdDT = new Date(Date.parse(CreatedAt));
        const now = new Date();
        const locale = "en-us";
        const englishMonth = createdDT.toLocaleString(locale, {month: "short"});
        const yearAddition = createdDT.getFullYear() === now.getFullYear() ? "" : `, ${createdDT.getFullYear()}`;
        const prettyCreatedAtString = `${englishMonth} ${createdDT.getDate()}${yearAddition} at ${createdDT.getHours()}:${createdDT.getMinutes()}`;
        return (
            <div className={'BlogPost'} key={ID}>
                <h3 className={'BlogPost-Title'}>{title}</h3>
                <p className={'BlogPost-Author'}>By UID {user.ID} ({user.firstName}) on {prettyCreatedAtString}</p>
                <div className={'BlogPost-Body'} ref={div => this.blogPostBody = div}>

                </div>
            </div>
        )
    }
}

export default BlogPost
