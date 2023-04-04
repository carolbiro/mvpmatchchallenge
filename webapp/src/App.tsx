import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import Authorization from './routes/auth/auth.component';
import { ApiError } from './services/api';
import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Products from './routes/products/products.component';
import { setCurrentUser } from './store/user/user.action';

import './App.css';

function App() {
  const  dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
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
                body: JSON.stringify({ token: refreshToken, username: decoded.username }),
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
              dispatch(setCurrentUser(user));
            } else {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              dispatch(setCurrentUser(null));
            }
          } else {
            dispatch(setCurrentUser(user));
          }
        }
      } catch(error) {
        console.error(error);
        if(error instanceof ApiError) 
          alert(error.message);
      }
    };

    fetchUser();
    // eslint-disable-next-line
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
