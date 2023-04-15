import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";

import { Dashboard } from "./routes/dashboard";
import { Login } from "./routes/login";
import { LoadingScreen } from "./Components/LoadingScreen";

import { User } from "firebase/auth";
import { initFirebaseAuth, getCurrentUser } from "./firebase/firebase";

export interface PageProps {
  userIsLoggedIn: "unknown" | boolean;
  loadingScreen: JSX.Element;
  setShowLoadingScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

function App() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const loadingScreen = <LoadingScreen showLoadingScreen={showLoadingScreen} />;
  const [currentUser, setCurrentUser] = useState<User | null | "unknown">(
    "unknown"
  );
  const userIsLoggedIn =
    currentUser === "unknown" ? "unknown" : currentUser !== null;

  useEffect(() => {
    initFirebaseAuth(setCurrentUser);
  }, []);

  const loader = async () => {
    const user = await getCurrentUser();
    if (!user) {
      return redirect("/login");
    }
    if (user) {
      return redirect("/app/inbox");
    }
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <></>,
      loader: loader,
    },
    {
      path: "/login",
      element: (
        <Login
          userIsLoggedIn={userIsLoggedIn}
          loadingScreen={loadingScreen}
          setShowLoadingScreen={setShowLoadingScreen}
        />
      ),
    },
    {
      path: "/app/:projectId?",
      element: (
        <Dashboard
          userIsLoggedIn={userIsLoggedIn}
          loadingScreen={loadingScreen}
          setShowLoadingScreen={setShowLoadingScreen}
        />
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
