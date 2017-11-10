import {observable, reaction, computed} from 'mobx'

class BlogPost {
    @observable id = null;
    @observable title = "";
    @observable body = "";
    @observable createdAt = new Date();

    constructor(store, id=null) {
        this.store = store;
        this.id = id;

        this.saveHandler = reaction(
            () => this.asJson,
            (json) => {
                if(this.autoSave) {
                    this.store.apiHelper.saveBlogPost(json)
                }
            }
        )
    }

    delete() {
        this.store.removeBlogPost(this.id);
    }

    @computed get asJson() {
        return {
            id: this.id,
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

    dispose() {
        this.saveHandler();
    }
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

    constructor(apiHelper, userStore) {
        this.apiHelper = apiHelper;
        this.userStore = userStore; // TODO: Hookup once UserStore is mature
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
        }).catch(err => {
            this.loadFailed = true;
        })
    }

    // updateTodoFromServer(json) {
    //     let blogPost = this.blogPosts.find(blogPost => blogPost.id === json.id);
    //     if (!blogPost) {
    //         blogPost = new BlogPost(this, json.id);
    //         this.blogPosts.push(blogPost);
    //     }
    //     if (json.isDeleted) {
    //         this.removeBlogPost(blogPost);
    //     } else {
    //         blogPost.updateFromJson(json);
    //     }
    // }

    /**
     * Creates a fresh blog post
     */
    createBlogPost() {
        const blogPost = new BlogPost(this);
        this.blogPosts.push(blogPost);
        return blogPost;
    }

    /**
     * Remove blog post from local store
     */
    removeBlogPost(blogPost) {
        this.blogPosts.splice(this.blogPosts.indexOf(blogPost), 1);
        blogPost.dispose();
    }

}

export default BlogPostStore
