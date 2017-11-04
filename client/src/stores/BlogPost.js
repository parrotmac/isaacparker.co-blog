import {observable, action} from 'mobx'

export const BLOG_POST_REQUEST_STATES = {
    INITIAL: "INITIAL",
    REQUESTING: "REQUESTING",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE"
};

const BLOG_POST_API_URL = '/api/posts';

class BlogPost {
    @observable blogPosts = [];
    @observable fetchState = BLOG_POST_REQUEST_STATES.INITIAL;

    @action
    fetchBlogPosts() {
        this.blogPosts = [];
        this.fetchState = BLOG_POST_REQUEST_STATES.REQUESTING;
        fetch(
            BLOG_POST_API_URL
        ).then(
            this.blogPostInterpretResponse
        ).then(
            this.blogPostFetchSuccess
        ).catch(
            this.blogPostFetchFailure
        )
    }

    @action.bound
    blogPostInterpretResponse(response) {
        if(response.ok) {
            return response.json()
        } else {
            this.blogPostFetchFailure(response.error)
        }
    }

    @action.bound
    blogPostFetchSuccess(json) {
        this.blogPosts = json;
        this.fetchState = BLOG_POST_REQUEST_STATES.SUCCESS;
    }

    @action.bound
    blogPostFetchFailure(error) {
        this.fetchState = BLOG_POST_REQUEST_STATES.FAILURE;
    }

    @action
    uploadBlogPost() {
        fetch(
            BLOG_POST_API_URL,
            {
                method: "POST",
                headers: {
                    'Authorization': `Bearer `
                }
            }
        )
    }

}

export default BlogPost
