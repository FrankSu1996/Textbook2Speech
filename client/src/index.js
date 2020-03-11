import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Table from './components/table/table';
//import Dashboard from './components/dashboard/dashboard';
//import Header from './components/header/Header';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

const routing = (
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/table" component={Table} />
      </div>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'));
