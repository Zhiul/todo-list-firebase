import { useEffect, useState } from "react";
import { Project, ProjectI } from "../../factories/project";

import { addProject } from "../../firebase/project/addProject";
import { editProject } from "../../firebase/project/editProject";

import { useDispatch } from "react-redux";
import { setProject } from "../../features/userDataSlice";

import { getActualTimestamp } from "../../utils/getActualTimestamp";

interface setProjectModalProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  project: ProjectI | null;
}
export function SetProjectModal({
  isActive,
  setIsActive,
  project,
}: setProjectModalProps) {
  const dispatch = useDispatch();

  const [projectTitleInputValue, setProjectTitleInputValue] = useState(
    project?.title || ""
  );

  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    getActualTimestamp().then((timestamp: number) => {
      setTimestamp(timestamp);
    });
  }, []);

  const allowUpload = projectTitleInputValue.length > 0;

  function handleProjectInput(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    if (target.value.length > 120) return;
    setProjectTitleInputValue(target.value);
  }

  async function handleSetProject() {
    let newProject: ProjectI;

    // If project prop is present, a project is being edited, otherwise a new one is being created

    if (!project) {
      newProject = Project(projectTitleInputValue, {}, timestamp);
    } else {
      newProject = { ...project };
      newProject.title = projectTitleInputValue;
    }

    dispatch(setProject({ project: newProject }));

    setIsActive(false);

    if (!project) {
      await addProject(newProject);
    } else {
      await editProject(newProject);
    }
  }

  return (
    <dialog className="set-project-modal modal" data-visible={isActive}>
      <form autoComplete="off">
        <header>
          <h2 className="set-project-modal-title">
            {project ? "Save project" : "Add project"}
          </h2>
        </header>

        <div className="set-project-modal-input-wrapper">
          <label htmlFor="project-input" id="project-input-label">
            Name
          </label>
          <input
            type="text"
            id="project-input"
            value={projectTitleInputValue}
            onChange={(e) => {
              handleProjectInput(e);
            }}
            autoComplete="off"
          />
        </div>

        <div className="set-project-modal-buttons">
          <button
            type="button"
            className="cta-cancel"
            onClick={() => {
              setIsActive(false);
            }}
          >
            Cancel
          </button>
          <button
            className="cta"
            type="button"
            aria-disabled={!allowUpload}
            onClick={handleSetProject}
          >
            {project ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
