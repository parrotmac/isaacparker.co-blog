import {observable} from 'mobx'

class User {

    constructor(apiHelper) {
        this.apiHelper = apiHelper;
    }

    @observable store;
    @observable id;
    @observable email;
    @observable isAdmin;
}

export default User
