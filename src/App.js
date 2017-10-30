import React, { Component } from 'react';
import './App.css';
import EditorPane from "./EditorPane";
import ContainerRow from "./components/ContainerRow";
import Header from "./components/Header";
import Blog from "./components/Blog";

class App extends Component {
    render() {
        return (
            <div>
                <ContainerRow>
                    <Header/>
                </ContainerRow>
                <ContainerRow>
                    <Blog/>
                </ContainerRow>
                <ContainerRow>
                    <EditorPane onChange={console.log} />
                </ContainerRow>
            </div>
        );
    }
}

export default App;
