import {observable, reaction, computed} from 'mobx'

class BlogPost {
    @observable id = null;
    @observable title = "";
    @observable body = "";
    @observable isPublished = false;
    @observable createdAt = new Date();

    constructor(store, id=null) {
        this.store = store;
        this.id = id;
        this.autoSave = true;

        const ctx = this;
        this.saveHandler = reaction(
            () => ctx.asJson,
            (json) => {
                if(ctx.autoSave) {
                    ctx.store.saveBlogPost(json)
                }
            }
        )
    }

    @computed get asJson() {
        return {
            ID: this.id,
            title: this.title,
            body: this.body,
            isPublished: this.isPublished,
            createdAt: this.createdAt
        }
    }

    updateFromJson(json) {
        this.autoSave = false;
        this.title = json.title;
        this.body = json.body;
        this.isPublished = json.isPublished;
        this.createdAt = json.createdAt;
        this.autoSave = true;
    }

    saveInstance() {
        return this.store.saveBlogPost({
            title: this.title,
            body: this.body,
            isPublished: this.isPublished,
            createdAt: this.createdAt
        })
    }

}

export const BLOG_POST_REQUEST_STATES = {
    INITIAL: "INITIAL",
    REQUESTING: "REQUESTING",
    SUCCESS: "SUCCESS",
    UPDATING: "UPDATING",
    DELETING: "DELETING",
    DELETED: "DELETED",
    FAILURE: "FAILURE"
};

class BlogPostStore {

    apiHelper;
    @observable blogPosts = [];
    @observable status = BLOG_POST_REQUEST_STATES.INITIAL;
    @observable errorText = null;

    constructor(apiHelper, userStore, authenticationStore) {
        this.apiHelper = apiHelper;
        this.userStore = userStore; // TODO: Hookup once UserStore is mature
        this.authenticationStore = authenticationStore;
        this.loadBlogPosts();
    }

    /**
     * Fetches all blog posts from the server
     */
    loadBlogPosts() {
        this.status = BLOG_POST_REQUEST_STATES.REQUESTING;
        this.apiHelper.getItemsListing(
            this.authenticationStore.jsonWebToken
        ).then(fetchedBlogPosts => {
            this.blogPosts = fetchedBlogPosts;
            this.status = BLOG_POST_REQUEST_STATES.SUCCESS;
        }).catch(err => {
            this.errorText = err;
            this.status = BLOG_POST_REQUEST_STATES.FAILURE;
        })
    }

    saveBlogPost(blogPostJson) {
        this.status = BLOG_POST_REQUEST_STATES.UPDATING;
        if('ID' in blogPostJson) {
            return this.apiHelper.saveItem(
                blogPostJson.ID, blogPostJson, this.authenticationStore.jsonWebToken
            ).then(
                res => {
                    this.status = BLOG_POST_REQUEST_STATES.SUCCESS;
                }
            ).catch( err => {
                this.status = BLOG_POST_REQUEST_STATES.FAILURE;
            })
        } else {
            return this.apiHelper.addItem(blogPostJson, this.authenticationStore.jsonWebToken).then(
                newBlogPost => {
                    const newPostIndex = this.blogPosts.indexOf(bp => bp.ID === newBlogPost.ID);
                    if (newPostIndex < 0) {
                        this.blogPosts.push(newBlogPost);
                        this.status = BLOG_POST_REQUEST_STATES.SUCCESS;
                        return newBlogPost
                    }
                }
            ).catch( err => {
                this.status = BLOG_POST_REQUEST_STATES.FAILURE;
                this.errorText = err;
            })
        }
    }

    deleteBlogPost(blogPost) {
        this.status = BLOG_POST_REQUEST_STATES.DELETING;
        return this.apiHelper.deleteItem(
            blogPost.ID,
            this.authenticationStore.jsonWebToken
        ).then(
            didDelete => {
                this.blogPosts.splice(this.blogPosts.indexOf(blogPost), 1);
                this.status = BLOG_POST_REQUEST_STATES.DELETED;
                return didDelete
            }
        ).catch(
            err => {
                this.status = BLOG_POST_REQUEST_STATES.FAILURE;
                this.errorText = err;
            }
        )
    }

    /**
     * Creates a fresh blog post
     */
    createBlogPost() {
        const blogPost = new BlogPost(this);
        this.blogPosts.push(blogPost);
        return blogPost;
    }

}

export default BlogPostStore
