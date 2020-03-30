import React from 'react';
import Dashboard from './components/dashboard/dashboard';
import Header from './components/Header';
import './App.css';

function App( {start} ) {
  return (
    <div className="App">
      <Header />
      <Dashboard start = {start}></Dashboard>
    </div>
  );
}

export default App;
