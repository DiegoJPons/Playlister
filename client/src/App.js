import "./App.css";
import { React } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AuthContextProvider } from "./auth";
import { GlobalStoreContextProvider } from "./store";
import {
  AppBanner,
  HomeWrapper,
  LoginScreen,
  CreateAccountScreen,
  EditAccountScreen,
  SongCatalogScreen,
} from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <GlobalStoreContextProvider>
          <AppBanner />
          <Switch>
            <Route path="/" exact component={HomeWrapper} />
            <Route path="/login/" exact component={LoginScreen} />
            <Route path="/register/" exact component={CreateAccountScreen} />
            <Route path="/edit-account/" exact component={EditAccountScreen} />
            <Route path="/song-catalog/" exact component={SongCatalogScreen} />
          </Switch>
        </GlobalStoreContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
