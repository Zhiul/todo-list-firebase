import { forwardRef } from "react";
import { DropdownButtonProps } from "../Dropdown";

import { ReactComponent as OptionsIcon } from "../../assets/elipsis.svg";

export const ProjectOptionsButton = ({
  isActive,
  setIsActive,
  refProp,
}: DropdownButtonProps) => {
  return (
    <button
      className="header-button header-options-button"
      aria-label="Open project settings"
      aria-expanded={isActive}
      onClick={() => {
        setIsActive(true);
      }}
      ref={refProp}
    >
      <OptionsIcon />
    </button>
  );
};
