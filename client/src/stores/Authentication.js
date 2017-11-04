import {observable, action, computed} from 'mobx'
import {promisedComputed} from "computed-async-mobx";

export const AUTHENTICATION_REQUEST_STATES = {
    INITIAL: "INITIAL",
    REQUESTING: "REQUESTING",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE"
};

const JWT_REQUEST_URL = '/auth/jwt/request';
const JWT_CHECK_URL = '/auth/jwt/validate';


const getStoredJsonWebToken = () => {
    return localStorage.getItem("JWT");
};

const storeJsonWebToken = (jwt) => {
    localStorage.setItem("JWT", jwt);
};

const clearStoredJsonWebToken = () => {
    localStorage.removeItem("JWT");
}

class Authentication {
    @observable jsonWebToken = getStoredJsonWebToken();

    getAuthStatus = promisedComputed(0, async () => {
        const response = await fetch(JWT_CHECK_URL, {
            headers: {
                "Authorization": `Bearer ${this.jsonWebToken}`
            }
        });
        const responseBody = await response.json();
        if("status" in responseBody) {
            return responseBody.status === "success"
        }
        clearStoredJsonWebToken();
        return false
    });

    @computed
    get userIsSignedIn() {
        return this.getAuthStatus.get();
    }

    @action
    requestJsonWebToken(email, password) {
        this.blogPosts = [];
        this.fetchState = AUTHENTICATION_REQUEST_STATES.REQUESTING;
        fetch(
            JWT_REQUEST_URL,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        ).then(
            this.checkAuthRequest
        ).then(
            this.authRequestSuccess
        ).catch(
            this.authRequestFailure
        )
    }

    @action.bound
    checkAuthRequest(response) {
        if(response.ok) {
            return response.json()
        } else {
            this.authRequestFailure(response.error)
        }
    }

    @action.bound
    authRequestSuccess(json) {
        const jwt = json.token;
        this.jsonWebToken = jwt;
        storeJsonWebToken(jwt);
        this.fetchState = AUTHENTICATION_REQUEST_STATES.SUCCESS;
    }

    @action.bound
    authRequestFailure(error) {
        this.fetchState = AUTHENTICATION_REQUEST_STATES.FAILURE;
    }

}

export default Authentication
