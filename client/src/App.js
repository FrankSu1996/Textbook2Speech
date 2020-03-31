import React from 'react';
import Dashboard from './components/dashboard/dashboard';
import Header from './components/Header';
import './App.css';

function App( {chapterStart, subChapterStart} ) {
  return (
    <div className="App">
      <Header />
      <Dashboard chapterStart = {chapterStart} subChapterStart = {subChapterStart}></Dashboard>
    </div>
  );
}

export default App;
