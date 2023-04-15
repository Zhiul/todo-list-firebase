import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as BurgerMenuIcon } from "../../assets/burger-menu.svg";
import { ReactComponent as CloseBurgerMenuIcon } from "../../assets/close.svg";
import { ReactComponent as HomeIcon } from "../../assets/home.svg";
import { ReactComponent as AddIcon } from "../../assets/add.svg";

import { CreateModal } from "../../utils/createModal";
import { TaskboxModal } from "../Task/Taskbox/TaskboxModal";

import { Dropdown } from "../Dropdown";
import { UserButton } from "./UserButton";
import { UserDropdown } from "./UserDropdown";

import { User } from "firebase/auth";

interface NavProps {
  showSidebar: boolean;
  inboxID: string;
  currentProjectID: string;
  setCurrentProjectID: React.Dispatch<React.SetStateAction<string>>;
  toggleSidebar: () => void;
  currentUser: User | null;
}

export const Nav = ({
  showSidebar,
  inboxID,
  currentProjectID,
  setCurrentProjectID,
  toggleSidebar,
  currentUser,
}: NavProps) => {
  const navigate = useNavigate();

  const burgerMenuIcon =
    showSidebar === false ? <BurgerMenuIcon /> : <CloseBurgerMenuIcon />;

  function goToInboxProject() {
    navigate(`/app/inbox`);
    setCurrentProjectID(inboxID);
  }

  const [showTaskboxModal, setShowTaskboxModal] = useState(false);
  const taskboxModal = CreateModal(
    TaskboxModal,
    { currentProjectID, inboxID },
    showTaskboxModal,
    setShowTaskboxModal,
    "overlay",
    200,
    true
  );

  return (
    <>
      {taskboxModal}

      <header className="main-nav">
        <section>
          <button
            className="nav-button nav-burger-menu"
            onClick={toggleSidebar}
            aria-label={showSidebar ? "Close sidebar" : "Open sidebar"}
          >
            {burgerMenuIcon}
          </button>

          <button
            className="nav-button nav-home-button"
            onClick={goToInboxProject}
            aria-label="Go to home"
          >
            <HomeIcon />
          </button>
        </section>

        <section>
          <button
            className="nav-button nav-add-task"
            aria-label="Add a new task"
            onClick={() => {
              setShowTaskboxModal(true);
            }}
          >
            <AddIcon />
          </button>

          <Dropdown
            Button={UserButton}
            ButtonProps={{ currentUser }}
            Dropdown={UserDropdown}
            DropdownProps={{ currentUser }}
            DynamicPositioning={false}
          />
        </section>
      </header>
    </>
  );
};
