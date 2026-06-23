import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios, { type AxiosInstance } from "axios";

type RecipeContextType = {
  login: boolean;
  setlogin: React.Dispatch<React.SetStateAction<boolean>>;
  api: AxiosInstance;
  isRegister: string;
  setisRegister: React.Dispatch<React.SetStateAction<string>>;
};

export const RecipeContext = createContext<RecipeContextType | null>(null);

type Props = {
  children: ReactNode;
};

const BackUrl = import.meta.env.VITEBACKENDURL;

const api = axios.create({
  baseURL: BackUrl,
  withCredentials: true,
  timeout: 30000 // 30-second connection timeout failsafe
});

// Dynamic Interceptor dynamically fetching token status before each call
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const Context = ({ children }: Props) => {
  const [login, setlogin] = useState<boolean>(false);
  const [isRegister, setisRegister] = useState<string>("login");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setlogin(true);
    }
  }, []);

  return (
    <RecipeContext.Provider value={{ login, setlogin, api, isRegister, setisRegister }}>
      {children}
    </RecipeContext.Provider>
  );
};

export default Context;