import { createContext, useCallback, useState, useEffect } from "react";
import { baseUrl, postRequest } from "../layout/hooks/utils/service";

export const AuthContext = createContext();

const AUTH_MODES = {
  LOGIN: "login",
  REGISTER: "register",
};

const INITIAL_STATE = {
  [AUTH_MODES.LOGIN]: {
    formData: {
      email: "",
      password: "",
    },
    error: null,
  },
  [AUTH_MODES.REGISTER]: {
    formData: {
      name: "",
      email: "",
      password: "",
    },
    error: null,
  },
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(AUTH_MODES.LOGIN);
  const [isLoading, setIsLoading] = useState(false);
  const [authState, setAuthState] = useState(INITIAL_STATE);

  useEffect(() => {
    const savedUser = localStorage.getItem("User");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const updateFormData = useCallback((data) => {
    setAuthState((prev) => ({
      ...prev,
      [authMode]: {
        ...prev[authMode],
        formData: data,
      },
    }));
  }, [authMode]);

  const handleAuth = useCallback(async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setAuthState((prev) => ({
      ...prev,
      [authMode]: {
        ...prev[authMode],
        error: null,
      },
    }));

    const endpoint = authMode === AUTH_MODES.REGISTER ? "register" : "login";
    const response = await postRequest(
      `${baseUrl}/users/${endpoint}`,
      JSON.stringify(authState[authMode].formData)
    );

    setIsLoading(false);

    if (response.error) {
      setAuthState((prev) => ({
        ...prev,
        [authMode]: {
          ...prev[authMode],
          error: response,
        },
      }));
      return;
    }

    localStorage.setItem("User", JSON.stringify(response));
    setUser(response);
  }, [authMode, authState]);

  const toggleAuthMode = useCallback(() => {
    setAuthMode((prev) => 
      prev === AUTH_MODES.LOGIN ? AUTH_MODES.REGISTER : AUTH_MODES.LOGIN
    );
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
    setAuthState(INITIAL_STATE);
  }, []);

  const contextValue = {
    user,
    isLoading,
    authMode,
    formData: authState[authMode].formData,
    error: authState[authMode].error,
    isRegister: authMode === AUTH_MODES.REGISTER,
    handleAuth,
    updateFormData,
    toggleAuthMode,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};