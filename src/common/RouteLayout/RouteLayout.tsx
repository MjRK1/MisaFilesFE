import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from 'hooks/AuthProvider';

export const RouteLayout = ({user, accessToken, refreshToken}: any) => {
  const { setUser, setRefreshToken, setAccessToken } = useAuth();
  useEffect(() => {
    if (setRefreshToken) setRefreshToken(refreshToken);
    if (setUser && user) setUser({ ...user });
    if (setAccessToken) setAccessToken(accessToken);
  }, [user, setUser]);
  return (
    <div className="mf-route-layout">
      <div className="mf-route-layout__main">
        <Outlet />
      </div>
    </div>
  );
};
