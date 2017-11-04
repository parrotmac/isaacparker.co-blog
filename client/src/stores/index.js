import User from './User';
import BlogPost from './BlogPost';
import PortfolioProject from "./PortfolioProject";
import Authentication from "./Authentication";

const stores = {
    User: new User(),
    BlogPost: new BlogPost(),
    PortfolioProject: new PortfolioProject(),
    Authentication: new Authentication(),
};
export default stores
