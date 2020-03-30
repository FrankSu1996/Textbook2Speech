import React from 'react';
import './App.css';
import App from './App';
import { Redirect } from 'react-router-dom'

function Home() {
  if (3>2) {
    return (
      <Redirect 
      to= {{
        pathname: "/dashboard",
        state: { begin: 3},
      }}
      />
    )
  }
  return (
    <h1>Home</h1>
  );
}

export default Home;