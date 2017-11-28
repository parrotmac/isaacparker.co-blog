import React, {Component} from 'react'
import "./styles/BlogPost.css"
import {Link} from "react-router-dom";
import AdminOnly from "./Admin/AdminOnly";

class BlogPost extends Component {
    componentDidMount() {
        this.blogPostBody.innerHTML = this.props.blogPost.body
    }

    componentWillReceiveProps(nextProps) {
        this.blogPostBody.innerHTML = nextProps.blogPost.body;
    }

    render() {
        const {ID, title, CreatedAt, IsPublished} = this.props.blogPost;
        const {titleLink} = this.props;
        const createdDT = new Date(Date.parse(CreatedAt));
        const now = new Date();
        const locale = "en-us";
        const englishMonth = createdDT.toLocaleString(locale, {month: "short"});
        const yearAddition = createdDT.getFullYear() === now.getFullYear() ? "" : `, ${createdDT.getFullYear()}`;
        const prettyCreatedAtString = `${englishMonth} ${createdDT.getDate()}${yearAddition} at ${createdDT.getHours()}:${createdDT.getMinutes()}`;
        return (
            <div className={'BlogPost'} key={ID}>
                <h3 className={'BlogPost-Title'}>
                    {typeof titleLink === 'undefined' ?
                        title
                        :
                        <Link to={titleLink}>{title}</Link>
                    }
                    </h3>
                <p className={'BlogPost-Meta'}>
                    {/*<i className="material-icons">person</i>*/}
                    {/*<span className={"BlogPost-LabelText"}> {user.firstName}</span>*/}
                    <AdminOnly>
                    {!IsPublished && <small>(Unpublished)</small>}
                    </AdminOnly>
                    <i className="material-icons">access_time</i>
                    <span className={"BlogPost-LabelText"}>{prettyCreatedAtString}</span>
                </p>
                <div className={'BlogPost-Body'} ref={div => this.blogPostBody = div}>

                </div>
            </div>
        )
    }
}

export default BlogPost
