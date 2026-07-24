import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { FormEvent, useEffect } from 'react'
export type User = { nickname: string; kakaoId: string }
type AuthContextValue = {
  user: User | null
  login: (name: string,) => string | null
  register: (typesPeo: string, kakaoId: string) => string | null
  logout: () => void
  SESSION_KEY: string
  setUser: Dispatch<SetStateAction<User | null>>
  usernum: number
  setUserNum: Dispatch<SetStateAction<number>>;
}
const AuthContext = createContext<AuthContextValue | null>(null)
const USERS_KEY = 'store-ledger-users'
const SESSION_KEY = 'store-ledger-session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  )
  const [usernum, setUserNum] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));

    const ddda = localStorage.getItem(SESSION_KEY);
    if (ddda != null) {
      setUser(JSON.parse(ddda));
    } else {
      setUser(null);
    }
  }, [usernum]);



  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login(name) {

        const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;;

        const redirectUri =
         import.meta.env.VITE_KAKAO_REDIRECT_URI;


        window.location.href =
          `https://kauth.kakao.com/oauth/authorize`
          +
          `?client_id=${clientId}`
          +
          `&redirect_uri=${redirectUri}`
          +
          `&response_type=code`
          +
          `&prompt=login`;

        return null
      },
       register(typesPeo, kakaoId) {
        fetchID(typesPeo, kakaoId);
        return null
      },
      logout() {
        const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;;
        const logoutRedirectUri = import.meta.env.VITE_KAKAO_Logout_REDIRECT_URI;

        window.location.href =
          `https://kauth.kakao.com/oauth/logout` +
          `?client_id=${clientId}` +
          `&logout_redirect_uri=${logoutRedirectUri}`;
        setUser(null);
        var numb = usernum + 1;
        setUserNum(numb);
      }, SESSION_KEY, setUser, usernum, setUserNum
    }),
    [user]
  )

  const fetchID = async (type: string, kakaoId: string) => {
    const response = await fetch("http://localhost:8080/oauth/kakao/signUp", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: type,
        kakaoId: kakaoId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const respData = await response.json();

    setUser(respData);
    var numb = usernum + 1;
    setUserNum(numb);
    navigate("/");
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}




export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
