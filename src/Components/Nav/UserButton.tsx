import { User } from "firebase/auth";

import { DropdownButtonProps } from "../Dropdown";

interface UserButtonProps extends DropdownButtonProps {
  currentUser: User;
}

export function UserButton({
  setIsActive,
  currentUser,
  refProp,
}: UserButtonProps) {
  return (
    <button
      className="user-profile"
      aria-label="Open user menu"
      onClick={() => {
        setIsActive(true);
      }}
      ref={refProp}
    >
      {currentUser?.photoURL && (
        <img src={currentUser.photoURL} referrerPolicy="no-referrer" alt="" />
      )}
    </button>
  );
}
