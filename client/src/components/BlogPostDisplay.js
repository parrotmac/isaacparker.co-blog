import React, {Component} from 'react'
import "./styles/BlogPost.css"
import {Link} from "react-router-dom";
import AdminOnly from "../containers/Admin/AdminOnly";
import {propTypes as PropTypes} from "mobx-react";

class BlogPostDisplay extends Component {
    // noinspection JSUnusedGlobalSymbols
    static propTypes = {
        blogPost: PropTypes.objectOrObservableObject.isRequired,
    };

    componentDidMount() {
        this.blogPostBody.innerHTML = this.props.blogPost.body
    }

    componentWillReceiveProps(nextProps) {
        this.blogPostBody.innerHTML = nextProps.blogPost.body;
    }

    render() {
        const {ID, title, CreatedAt, isPublished} = this.props.blogPost;
        const {titleLink} = this.props;
        const createdDT = new Date(Date.parse(CreatedAt));
        const now = new Date();
        const locale = "en-us";
        const englishMonth = createdDT.toLocaleString(locale, {month: "short"});
        const yearAddition = createdDT.getFullYear() === now.getFullYear() ? "" : `,m ${createdDT.getFullYear()}`;
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
                    <AdminOnly>
                    {!isPublished && <small>(Unpublished)</small>}
                    </AdminOnly>
                    <i className="material-icons">access_time</i>
                    <span className={"BlogPost-LabelText"}>{prettyCreatedAtString}</span>
                </p>
                <div className={'BlogPost-Body'} ref={div => this.blogPostBody = div}> </div>
            </div>
        )
    }
}

export default BlogPostDisplay
