import {observable} from 'mobx'

class User {

    constructor(apiHelper) {
        this.apiHelper = apiHelper;
    }

    store;
    id;
    @observable email;
    isAdmin;

}

export default User
