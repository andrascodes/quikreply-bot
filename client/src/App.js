import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Navbar, Sidebar } from './Navigation'
import { Main } from './Main'

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar 
            brand="QuikReply Analytics"
          />
          <Sidebar />
          <Main>
            <Route exact path="/" />
            <Route exact path="/conversations" />
            <Route path="/conversations/:id" />
          </Main>
        </div>
      </Router>
    );
  }
}

export default App;
