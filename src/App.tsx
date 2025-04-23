import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from 'pages/HomePage';
import AuthDataProvider from 'hooks/AuthProvider';
import { RouteLayout } from 'common/RouteLayout';

const App = ({user, accessToken, refreshToken}: any) => {
  return (
    <AuthDataProvider>
      <Routes>
        <Route
          path='/'
          element={<RouteLayout user={user} accessToken={accessToken} refreshToken={refreshToken} />}
        >
          <Route path='/' element={<HomePage />} />
        </Route>
      </Routes>
    </AuthDataProvider>
  );
};

export default App;
