import { DropdownProps } from "../Dropdown";

import { SectionOption } from "./SectionOption";

import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { ReactComponent as DeleteIcon } from "../../assets/delete.svg";

interface SectionOptionsDropdownProps extends DropdownProps {
  enableEditSectionForm: () => void;
  enableDeleteSectionModal: () => void;
}

export const SectionOptionsDropdown = ({
  setIsActive,
  refProp,
  enableEditSectionForm,
  enableDeleteSectionModal,
}: SectionOptionsDropdownProps) => {
  return (
    <div className="dropdown" ref={refProp}>
      <ul className="project-dropdown-options" role="menu">
        <SectionOption
          text="Edit section"
          Icon={EditIcon}
          setIsActive={setIsActive}
          action={enableEditSectionForm}
        />

        <SectionOption
          text="Delete section"
          Icon={DeleteIcon}
          setIsActive={setIsActive}
          action={enableDeleteSectionModal}
        />
      </ul>
    </div>
  );
};
