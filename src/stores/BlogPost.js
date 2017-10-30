import {observable} from 'mobx'

class BlogPost {
    store;
    id;
    @observable email;
    isAdmin;

}

export default BlogPost
