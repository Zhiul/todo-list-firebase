import { useState, useRef } from "react";
import { ReactComponent as CloseIcon } from "../assets/close.svg";
import { useModalAnimation } from "../utils/useModalAnimation";

interface DeleteModalProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  processIsRunning: boolean;
  setProcessIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  elementType: string;
  elementName: string;
  deleteAction: () => void | Promise<void>;
}

export const DeleteModal = ({
  isActive,
  setIsActive,
  elementType,
  elementName,
  deleteAction,
}: DeleteModalProps) => {
  const deleteModalRef = useRef(null);

  const [elementNameState] = useState(elementName);
  useModalAnimation(deleteModalRef, isActive, true);

  return (
    <dialog
      className="delete-modal modal"
      data-visible={isActive}
      ref={deleteModalRef}
    >
      <header className="delete-modal-header">
        <h2>Delete {elementType}</h2>
        <button
          type="button"
          className="delete-modal-close-button"
          onClick={() => {
            setIsActive(false);
          }}
        >
          <CloseIcon />
        </button>
      </header>

      <p className="delete-modal-description">
        Are you sure you want to delete{" "}
        <span className="delete-modal-element-name">{elementNameState}</span>?
      </p>

      <div className="delete-modal-buttons">
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
          type="button"
          className="cta"
          onClick={() => {
            deleteAction();
          }}
        >
          Delete
        </button>
      </div>
    </dialog>
  );
};
