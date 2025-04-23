import React from 'react';
import { createContext, ReactNode, useContext, useState } from 'react';
import { User } from 'types/User/user';


export const AuthContext = createContext<{
  user: User | null,
  setUser?: React.Dispatch<React.SetStateAction<User | null>>,
  setRefreshToken?: React.Dispatch<React.SetStateAction<string | null>>,
  setAccessToken?: React.Dispatch<React.SetStateAction<string | null>>,
  accessToken: string | null,
  refreshToken: string | null,
  refreshAccessToken?: (token: string | null) => Promise<any>,
  }>({
  user: null,
  accessToken: null,
  refreshToken: null,
});

const AuthDataProvider = (
  { children }: { children: ReactNode }
) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  return (
    <>
      <AuthContext.Provider
        value={{
          accessToken,
          refreshToken,
          user,
          setUser,
          setAccessToken,
          setRefreshToken,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthDataProvider;
export const useAuth = () => useContext(AuthContext);
