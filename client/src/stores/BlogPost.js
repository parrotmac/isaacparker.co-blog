import {observable, reaction, computed} from 'mobx'

class BlogPost {
    @observable id = null;
    @observable title = "";
    @observable body = "";
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
            createdAt: this.createdAt
        }
    }

    updateFromJson(json) {
        this.autoSave = false;
        this.title = json.title;
        this.body = json.body;
        this.createdAt = json.createdAt;
        this.autoSave = true;
    }

    saveInstance() {
        return this.store.saveBlogPost({
            title: this.title,
            body: this.body,
            createdAt: this.createdAt
        })
    }

    // dispose() {
    //     this.saveHandler();
    // }
}

export const BLOG_POST_REQUEST_STATES = {
    INITIAL: "INITIAL",
    REQUESTING: "REQUESTING",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE"
};

class BlogPostStore {

    apiHelper;
    @observable blogPosts = [];
    @observable isLoading = true;
    @observable loadFailed = false;
    @observable errorText = null;

    constructor(apiHelper, userStore, authenticationStore) {
        this.apiHelper = apiHelper;
        console.log("APIHELPER", apiHelper);
        this.userStore = userStore; // TODO: Hookup once UserStore is mature
        this.authenticationStore = authenticationStore;
        this.loadBlogPosts();
    }

    /**
     * Fetches all blog posts from the server
     */
    loadBlogPosts() {
        this.isLoading = true;
        this.apiHelper.getItemsListing().then(fetchedBlogPosts => {
            this.blogPosts = fetchedBlogPosts;
            // fetchedBlogPosts.forEach(json => this.updateTodoFromServer(json));
            this.isLoading = false;
            this.loadFailed = false;
        }).catch(err => {
            this.loadFailed = true;
        })
    }

    saveBlogPost(blogPostJson) {
        if('ID' in blogPostJson) {
            this.apiHelper.saveItem(blogPostJson.ID, blogPostJson, this.authenticationStore.jsonWebToken)
        } else {
            return this.apiHelper.addItem(blogPostJson, this.authenticationStore.jsonWebToken).then(
                newBlogPost => {
                    const newPostIndex = this.blogPosts.indexOf(bp => bp.ID === newBlogPost.ID);
                    if (newPostIndex < 0) {
                        this.blogPosts.push(newBlogPost);
                        return newBlogPost
                    }
                }
            )
        }
    }

    deleteBlogPost(blogPost) {
        this.isLoading = true;
        return this.apiHelper.deleteItem(blogPost.ID, this.authenticationStore.jsonWebToken).then(
            didDelete => {
                this.blogPosts.splice(this.blogPosts.indexOf(blogPost), 1);
                this.isLoading = false;
                return didDelete
            }
        ).catch(
            err => {
                this.isLoading = false;
                this.loadFailed = true;
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
