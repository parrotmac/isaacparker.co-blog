import React, { Component } from 'react';
import './App.css';
import ContainerRow from "./components/ContainerRow";
import Header from "./components/Header";
import Blog from "./components/Blog";
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom'
import Portfolio from "./components/Portfolio";
import Social from "./components/Social";
import Contact from "./components/Contact";
import NewBlogPost from "./components/NewBlogPost";
import Main from "./components/Main";
import Footer from "./components/Footer";
import PortfolioExpose from "./components/PortfolioExpose";

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <ContainerRow>
                        <Header/>
                    </ContainerRow>
                    <ContainerRow>
                        <Main>
                            <Route exact path="/" component={Blog}/>

                            <Route exact path="/blog" component={Blog}/>
                            <Route exact path="/blog/new" component={NewBlogPost}/>

                            <Route path="/portfolio" component={Portfolio}/>

                            <Route path={`/portfolio/:projectSlug`} component={PortfolioExpose}/>

                            <Route exact path="/social" component={Social}/>

                            <Route exact path="/contact" component={Contact}/>
                        </Main>
                    </ContainerRow>
                    <ContainerRow>
                        <Footer/>
                    </ContainerRow>
                </div>
            </Router>
        );
    }
}

export default App;
