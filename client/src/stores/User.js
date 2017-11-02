import {observable} from 'mobx'

class User {
    store;
    id;
    @observable email;
    isAdmin;

}

export default User
