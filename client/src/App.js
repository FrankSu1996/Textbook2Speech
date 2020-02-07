import React, { Component } from 'react';
import Dashboard from './components/dashboard/dashboard';
import Header from './components/Header.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header/>
      <Dashboard></Dashboard>
    </div>
  );
}

export default App;
