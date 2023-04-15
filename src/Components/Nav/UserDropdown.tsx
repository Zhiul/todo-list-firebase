import { DropdownProps } from "../Dropdown";

import { ReactComponent as LogOutIcon } from "../../assets/log-out.svg";

import { signOutUser } from "../../firebase/firebase";
import { User } from "firebase/auth";

interface UserDropdownProps extends DropdownProps {
  currentUser: User;
}

export function UserDropdown({
  setIsActive,
  currentUser,
  refProp,
}: UserDropdownProps) {
  return (
    <div className="user-dropdown dropdown" ref={refProp}>
      <div className="user-info">
        <div className="user-profile user-profile-big">
          {currentUser.photoURL && (
            <img
              src={currentUser.photoURL}
              referrerPolicy="no-referrer"
              alt=""
            />
          )}
        </div>

        <div className="user-info-text">
          <span className="user-info-name">
            <span className="sr-only">User name:</span>{" "}
            {currentUser.displayName}
          </span>
          <span className="user-info-email">
            <span className="sr-only">User email:</span> {currentUser.email}
          </span>
        </div>
      </div>

      <div className="user-dropdown-separator"></div>

      <button
        className="user-dropdown-log-out"
        onClick={() => {
          signOutUser();
          setIsActive(false);
        }}
      >
        <div className="user-dropdown-log-out-icon">
          <LogOutIcon />
        </div>
        <div className="user-dropdown-log-out-text">Log out</div>
      </button>
    </div>
  );
}
