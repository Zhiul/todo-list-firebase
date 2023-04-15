import { DropdownButtonProps } from "../Dropdown";

import { ReactComponent as OptionsIcon } from "../../assets/elipsis.svg";

export const SectionOptionsButton = ({
  setIsActive,
  refProp,
}: DropdownButtonProps) => {
  return (
    <button
      className="header-button header-options-button"
      aria-label="Open section settings"
      onClick={() => {
        setIsActive(true);
      }}
      ref={refProp}
    >
      <OptionsIcon />
    </button>
  );
};
