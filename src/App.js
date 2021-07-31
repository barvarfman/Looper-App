import React from 'react';
import './styles/style.scss'
import { HomePage } from './pages/HomePage/HomePage.jsx';
import { HeaderApp } from './cmps/HeaderApp/HeaderApp.jsx';

function App() {
  return (
    <div className="App">
      <HeaderApp />
      <HomePage />
    </div>
  );
}

export default App;
