import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import authRequestSender from "./requests";

const AuthContext = createContext();
// console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
  GET_LOGGED_IN: "GET_LOGGED_IN",
  LOGIN_USER: "LOGIN_USER",
  LOGOUT_USER: "LOGOUT_USER",
  REGISTER_USER: "REGISTER_USER",
  UPDATE_USER: "UPDATE_USER",
  LOGIN_GUEST: "LOGIN_GUEST",
};

function AuthContextProvider(props) {
  const [auth, setAuth] = useState({
    user: null,
    loggedIn: false,
    errorMessage: null,
  });
  const history = useHistory();

  useEffect(() => {
    auth.getLoggedIn();
  }, []);

  const authReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case AuthActionType.GET_LOGGED_IN: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          errorMessage: null,
        });
      }
      case AuthActionType.LOGIN_GUEST:
      case AuthActionType.LOGIN_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          errorMessage: payload.errorMessage,
        });
      }
      case AuthActionType.LOGOUT_USER: {
        return setAuth({
          user: null,
          loggedIn: false,
          errorMessage: null,
        });
      }
      case AuthActionType.REGISTER_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          errorMessage: payload.errorMessage,
        });
      }
      case AuthActionType.UPDATE_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
          errorMessage: payload.errorMessage,
        });
      }
      default:
        return auth;
    }
  };

  auth.updateUser = async function (
    userName,
    password,
    passwordConfirm,
    avatarUrl
  ) {
    console.log("UPDATING USER");
    try {
      const response = await authRequestSender.updateUser(
        userName,
        password,
        passwordConfirm,
        avatarUrl
      );

      if (response.status === 200) {
        authReducer({
          type: AuthActionType.UPDATE_USER,
          payload: {
            user: response.data.user,
            errorMessage: null,
          },
        });
      }
    } catch (error) {
      authReducer({
        type: AuthActionType.UPDATE_USER,
        payload: {
          user: auth.user,
          errorMessage: error.response.data.errorMessage,
        },
      });
    }
  };

  auth.getLoggedIn = async function () {
    const response = await authRequestSender.getLoggedIn();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.GET_LOGGED_IN,
        payload: {
          loggedIn: response.data.loggedIn,
          user: response.data.user,
        },
      });
    }
  };

  auth.registerUser = async function (
    userName,
    email,
    password,
    passwordVerify,
    avatarUrl
  ) {
    console.log("REGISTERING USER");
    try {
      const response = await authRequestSender.registerUser(
        userName,
        email,
        password,
        passwordVerify,
        avatarUrl
      );
      if (response.status === 200) {
        console.log("Registered Sucessfully");
        authReducer({
          type: AuthActionType.REGISTER_USER,
          payload: {
            user: response.data.user,
            loggedIn: true,
            errorMessage: null,
          },
        });
        history.push("/login");
        console.log("NOW WE LOGIN");
        auth.loginUser(email, password);
        console.log("LOGGED IN");
      }
    } catch (error) {
      authReducer({
        type: AuthActionType.REGISTER_USER,
        payload: {
          user: auth.user,
          loggedIn: false,
          errorMessage: error.response.data.errorMessage,
        },
      });
    }
  };

  auth.loginGuest = async function () {
    try {
      const response = await authRequestSender.loginGuest();
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.LOGIN_GUEST,
          payload: {
            user: response.data.user,
            loggedIn: true,
            errorMessage: null,
          },
        });
        history.push("/");
      }
    } catch (error) {
      authReducer({
        type: AuthActionType.LOGIN_GUEST,
        payload: {
          user: null,
          loggedIn: false,
          errorMessage: error.response.data.errorMessage,
        },
      });
    }
  };
  auth.loginUser = async function (email, password) {
    try {
      const response = await authRequestSender.loginUser(email, password);
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.LOGIN_USER,
          payload: {
            user: response.data.user,
            loggedIn: true,
            errorMessage: null,
          },
        });
        history.push("/");
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.errorMessage
        : "Network/CORS Error: Could not connect to server.";
      authReducer({
        type: AuthActionType.LOGIN_USER,
        payload: {
          user: auth.user,
          loggedIn: false,
          errorMessage: errorMessage,
        },
      });
    }
  };

  auth.logoutUser = async function () {
    const response = await authRequestSender.logoutUser();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.LOGOUT_USER,
        payload: null,
      });
      history.push("/");
    }
  };

  auth.getUserInitials = function () {
    let initials = "";
    if (auth.user) {
      initials += auth.user.userName.charAt(0);
      initials += auth.user.userName.charAt(1);
    }
    console.log("user initials: " + initials);
    return initials;
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
