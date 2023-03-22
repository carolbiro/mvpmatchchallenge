import React, { useEffect, useState, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Authorization from './routes/auth/auth.component';
import { AuthenticationContext } from './contexts/authentication.context';
import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Products from './routes/products/products.component';

import './App.css';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

function App() {
  const { currentAuthentication: currentAuthentication, setCurrentAuthentication: setCurrentAuthentication } = useContext(AuthenticationContext);

  useEffect(() => {
    // if(currentAuthentication){
    const fetchToken = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
          const tokenPayload = accessToken.split('.')[1];
          const decoded = JSON.parse(atob(tokenPayload));
          const { exp, iat, ...user } = decoded;

          // Check if access token is expired
          if (Date.now() >= exp * 1000) {
            const refreshTokenPayload = refreshToken.split('.')[1];
            const decoded = JSON.parse(atob(refreshTokenPayload));
            // Check if refresh token is still valid
            if (Date.now() <= decoded.exp * 1000) {
              // Access token has expired, request a new one using refresh token
              const response = await fetch('/auth/refreshTokens', {
                method: 'POST',
                body: JSON.stringify({ token: refreshToken, username: currentAuthentication?.user.username }),
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              const res = await response.json();

              if (!response.ok) {
                throw new ApiError(`${res.message}`);
              }

              localStorage.setItem('accessToken', res.accessToken);
              localStorage.setItem('refreshToken', res.refreshToken);
              setCurrentAuthentication({ user: user, accessToken: res.accessToken, refreshToken: res.refreshToken });
            } else {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              setCurrentAuthentication(null);
            }
          } else {
            setCurrentAuthentication({ user: user, accessToken: accessToken, refreshToken: refreshToken });
          }
        }
      } catch(error) {
        console.error(error);
        if(error instanceof ApiError) 
          alert(error.message);
      }
    };

    fetchToken();
    // }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path='auth' element={<Authorization />} />
          <Route path='products' element={<Products />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
