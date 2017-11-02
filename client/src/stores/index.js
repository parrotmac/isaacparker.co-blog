import User from './User';
import BlogPost from './BlogPost';
import PortfolioProject from "./PortfolioProject";

const stores = {
    User: new User(),
    BlogPost: new BlogPost(),
    PortfolioProject: new PortfolioProject(),
};
export default stores
