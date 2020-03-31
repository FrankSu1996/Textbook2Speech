import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Home from './home';
import Table from './components/table/table';
//import Dashboard from './components/dashboard/dashboard';
//import Header from './components/header/Header';
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

window.$chStart = 0
window.$subStart = 0
const routing = (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route 
          path="/dashboard"
          render = {(props) => (
            <App {...props} chapterStart={window.$chStart} subChapterStart={window.$subStart} />
          )}
          />
        <Route path="/table" component={Table} />
      </div>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'));
