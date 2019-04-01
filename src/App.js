import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './Login';
import Register from './Register'
import Todo from './Todo';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path='/' component={Login}/>
          <Route path='/register' component={Register}></Route>
          <Route path='/todo' component={Todo}></Route>
        </div>
      </Router>
    );
  }
}

export default App;
