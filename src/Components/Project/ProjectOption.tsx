interface ProjectOptionProps {
  text: string;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  action: () => void;
}

export const ProjectOption = ({
  text,
  Icon,
  setIsActive,
  action,
}: ProjectOptionProps) => {
  return (
    <div
      className="project-dropdown-option"
      role="menuitem"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        action();
        setIsActive(false);
      }}
    >
      <div className="project-dropdown-option-icon">
        <Icon />
      </div>
      <span className="project-dropdown-option-text">{text}</span>
    </div>
  );
};
