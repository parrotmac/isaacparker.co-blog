import React, { Component } from 'react';
import './App.css';
import Header from "./components/Header";
import Blog from "./components/Blog";
import {
    BrowserRouter as Router, Redirect,
    Route, Switch
} from 'react-router-dom'
import Portfolio from "./components/Portfolio";
import Social from "./components/Social";
import Contact from "./components/Contact";
import NewBlogPost from "./components/NewBlogPost";
import Main from "./components/Main";
import Footer from "./components/Footer";
import PortfolioExpose from "./components/PortfolioExpose";
import AuthLanding from "./components/Auth/AuthLanding";
import AdminPage from "./components/AdminPage";
import BlogPostPage from "./components/BlogPostPage";

class RedirectToBlog extends Component {
    render() {
        return (
            <Redirect to="/blog"/>
        )
    }
}

class App extends Component {
    render() {
        return (
            <Router>
                <div className="RootContainer">
                    <div className="container container-full-width">
                        <div className={'row'}>
                            <Header/>
                        </div>
                        <div className={'row'}>
                            <Main>
                                <Route exact path="/" component={RedirectToBlog}/>

                                <Switch>
                                    <Route exact path="/blog" component={Blog}/>
                                    <Route exact path="/blog/new" component={NewBlogPost}/>
                                    <Route path="/blog/:blogPostId" component={BlogPostPage} />
                                </Switch>

                                <Route path="/portfolio" component={Portfolio}/>

                                <Route path={`/portfolio/:projectSlug`} component={PortfolioExpose}/>

                                <Route exact path="/social" component={Social}/>

                                <Route exact path="/contact" component={Contact}/>

                                <Route exact path="/account" component={AuthLanding}/>

                                <Route exact path="/admin" component={AdminPage}/>
                            </Main>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </Router>
        );
    }
}

export default App;
