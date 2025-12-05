import { useContext } from "react";
import PlaylistsScreen from "./PlaylistsScreen";
import WelcomeScreen from "./WelcomeScreen";
import AuthContext from "../auth";

export default function HomeWrapper() {
  const { auth } = useContext(AuthContext);
  console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);

  if (auth.loggedIn) return <PlaylistsScreen />;
  else return <WelcomeScreen />;
}
