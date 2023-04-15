import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { PageProps } from "../App";
import { Nav } from "../Components/Nav/Nav";
import { Sidebar } from "../Components/Sidebar/Sidebar";
import { Project } from "../Components/Project/Project";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { set } from "../features/userDataSlice";

import { User } from "firebase/auth";
import { getUserData, getCurrentUser } from "../firebase/firebase";

export function Dashboard({
  userIsLoggedIn,
  loadingScreen,
  setShowLoadingScreen,
}: PageProps) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const didInitialize = useRef(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProjectID, setCurrentProjectID] = useState("");

  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const userData = useSelector((state: RootState) => state.userData);
  const currentProject = useSelector(
    (state: RootState) => state.userData?.projects[currentProjectID]
  );

  async function initializeDashboard() {
    if (didInitialize.current) return;
    if (didInitialize.current === false) didInitialize.current = true;

    setShowLoadingScreen(true);

    const currentUser = await getCurrentUser();
    setCurrentUser(currentUser);

    const userData = await getUserData();

    if (userData) {
      dispatch(set(userData));

      if (!projectId) navigate("./inbox");

      if (projectId === "inbox" || !projectId) {
        setCurrentProjectID(userData.inboxID);
      } else if (!userData.projects[projectId]) {
        navigate("/app/inbox");
        setCurrentProjectID(userData.inboxID);
      } else {
        setCurrentProjectID(projectId);
      }

      setTimeout(() => {
        setShowLoadingScreen(false);
      }, 200);
    }
  }

  useEffect(() => {
    initializeDashboard();
  }, []);

  useEffect(() => {
    if (userIsLoggedIn === false) navigate("/login");
  }, [userIsLoggedIn]);

  return (
    <>
      {loadingScreen}

      {userData && currentProject && (
        <>
          <Nav
            showSidebar={showSidebar}
            inboxID={userData.inboxID}
            currentProjectID={currentProjectID}
            setCurrentProjectID={setCurrentProjectID}
            toggleSidebar={toggleSidebar}
            currentUser={currentUser}
          />
          <Sidebar
            projects={userData.projects}
            inboxID={userData.inboxID}
            showSidebar={showSidebar}
            toggleSidebar={toggleSidebar}
            currentProjectID={currentProjectID}
            setCurrentProjectID={setCurrentProjectID}
          />
          <Project
            project={currentProject}
            inboxID={userData.inboxID}
            setCurrentProjectID={setCurrentProjectID}
            key={currentProjectID}
          />
        </>
      )}
    </>
  );
}
