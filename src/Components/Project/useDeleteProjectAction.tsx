import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { deleteProject as deleteProjectReducerAction } from "../../features/userDataSlice";

import { deleteProject } from "../../firebase/project/deleteProject";
import { ProjectI } from "../../factories/project";

export function useDeleteProjectAction(
  project: ProjectI | null,
  inboxID: string,
  setShowDeleteProjectModal: React.Dispatch<React.SetStateAction<boolean>>,
  currentProjectID: string,
  setCurrentProjectID: React.Dispatch<React.SetStateAction<string>>
) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return async function deleteProjectAction() {
    if (!project) return;

    setShowDeleteProjectModal(false);

    if (currentProjectID === project.id) {
      navigate(`/app/inbox`);
      setCurrentProjectID(inboxID);
    }

    dispatch(deleteProjectReducerAction({ projectID: project.id }));

    await deleteProject(project);
  };
}
