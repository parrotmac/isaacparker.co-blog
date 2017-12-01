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
import Main from "./components/Main";
import Footer from "./components/Footer";
import PortfolioExpose from "./components/PortfolioExpose";
import AuthLanding from "./components/Auth/AuthLanding";
import AuthInitializer from "./components/AuthInitializer";
import PageNotFound from "./components/PageNotFound";
import BlogPostDetail from "./containers/Admin/BlogPostDetail";
import BlogPostCreator from "./containers/Admin/BlogPostCreator";

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
                    <AuthInitializer />
                    <div className="container container-full-width">
                        <div className={'row'}>
                            <Header/>
                        </div>
                        <div className={'row'}>
                            <Main>
                                <Switch>
                                    <Route exact path="/" component={RedirectToBlog}/>

                                    <Route exact path="/blog" component={Blog}/>
                                    <Route exact path="/blog/new" component={BlogPostCreator}/>
                                    <Route path="/blog/:blogPostId" component={BlogPostDetail} />

                                    <Route path="/portfolio" component={Portfolio}/>

                                    <Route path={`/portfolio/:projectSlug`} component={PortfolioExpose}/>

                                    <Route exact path="/social" component={Social}/>

                                    <Route exact path="/contact" component={Contact}/>

                                    <Route exact path="/account" component={AuthLanding}/>

                                    <Route component={PageNotFound} />
                                </Switch>
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
