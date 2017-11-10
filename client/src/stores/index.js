import User from './User';
import BlogPostStore from './BlogPost';
import PortfolioProject from "./PortfolioProject";
import Authentication from "./Authentication";
import APIHelper from "../utils/APIHelper";

const userAPIHelper = new APIHelper('/api/users');
const blogPostAPIHelper = new APIHelper('/api/posts');

const userStore = new User(userAPIHelper);
const blogPostStore = new BlogPostStore(blogPostAPIHelper);
const portfolioStore = new PortfolioProject();
const authenticationStore = new Authentication();

const RootStore = {
    userStore: userStore,
    blogPostStore: blogPostStore,
    portfolioStore: portfolioStore,
    authStore: authenticationStore
};
export default RootStore
