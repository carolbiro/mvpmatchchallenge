import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Authentication from './routes/authentication/authentication.component';
import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Products from './routes/products/products.component';

import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path='auth' element={<Authentication />} />
          <Route path='products' element={<Products />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
