import './App.css';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { FilesHomePage } from 'pages/FilesHomePage';
import AuthDataProvider from 'hooks/AuthProvider';
import { RouteLayout } from 'common/RouteLayout';
import { ConfigProvider } from 'antd';

const App = ({user, accessToken, refreshToken}: any) => {
  return (
    <AuthDataProvider>
      <ConfigProvider
        theme={
          {
            token: {
              colorPrimary: 'var(--color-white)',
              colorErrorHover: '#FF7474',
              colorError: '#FF7474',
              colorPrimaryHover: 'var(--color-white)',
              colorText: 'var(--color-black4)',
              colorTextQuaternary: 'var(--color-grey0)',
              fontSize: 16,
              fontFamily: 'Montserrat, sans-serif',
              colorBgContainer: 'var(--color-white)',
              controlHeight: 36,
              colorBgElevated: 'var(--color-white)',
              colorBorder: 'var(--color-lion)',
              colorBorderSecondary: 'var(--color-lion)',
              colorIcon: 'var(--color-white)',
            },
            components: {
              Button: {
                defaultHoverColor: 'var(--color-white)',
                colorPrimary: 'var(--color-white0)',
                colorPrimaryHover: 'var(--color-ecru)',
                colorText: 'var(--color-white)',
                colorBgContainer: 'var(--color-ecru)',
                dangerColor: 'var(--color-white)',
                dangerShadow: 'var(--color-red)',
              },
              Input: {
                activeBorderColor: 'var(--color-lion)',
                activeShadow: 'var(--color-lion)',
                errorActiveShadow: 'var(--color-lion)',
                hoverBorderColor: 'var(--color-lion)',
                colorText: 'var(--color-black4)',
              },
              Form: {
                labelColor: 'var(--color-black4)',
              },
              Message: {
                contentBg: 'var(--color-ecru)',
                colorInfo: 'var(--color-white)',
                colorSuccess: 'var(--color-success)'
              },
              Spin: {
                colorPrimary: 'var(--color-ecru)'
              },
              Drawer: {
                colorPrimary: 'var(--color-ecru)',
                colorBgElevated: 'var(--color-black6)',
                colorIcon: 'var(--color-ecru)',
                colorIconHover: 'var(--color-lion)',
                colorPrimaryBorder: 'var(--color-ecru)',
                colorText: 'var(--color-white)',
              }
            }
          }
        }
      >
        <Routes>
          <Route
            path='/'
            element={<RouteLayout user={user} accessToken={accessToken} refreshToken={refreshToken} />}
          >
            <Route path='/home/*' element={<FilesHomePage />} />
            <Route path='/' element={<Navigate to='/core/modules/MisaFiles/home' replace />} />
          </Route>
        </Routes>
      </ConfigProvider>
    </AuthDataProvider>
  );
};

export default App;
