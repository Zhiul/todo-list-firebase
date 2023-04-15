import { useEffect, useState } from "react";

import { NewAddSectionBoxObserver } from "../Project/Project";

import { SectionI } from "../../factories/section";
import { Section } from "../../factories/section";

import { getActualTimestamp } from "../../utils/getActualTimestamp";

import { useDispatch } from "react-redux";
import { setSection } from "../../features/userDataSlice";

import { addSection } from "../../firebase/section/addSection";
import { editSection } from "../../firebase/section/editSection";

interface sectionFormProps {
  disableSectionForm: () => void;
  projectID: string;
  section?: SectionI;
}

export const SectionForm = ({
  disableSectionForm,
  projectID,
  section,
}: sectionFormProps) => {
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    // If the section form is of type "add" the disable function is subscribed in order to make the section form unmount when another one is enabled

    if (!section) NewAddSectionBoxObserver.subscribe(disableSectionForm);

    getActualTimestamp().then((timestamp) => {
      setTimestamp(timestamp);
    });

    return () => {
      if (!section) NewAddSectionBoxObserver.unsubscribe(disableSectionForm);
    };
  });

  const dispatch = useDispatch();

  const type = section ? "edit" : "add";
  const [sectionTitle, setSectionTitle] = useState(
    section ? section.title : ""
  );
  const allowUpload = sectionTitle.length > 0;

  function handleSectionTitleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 120) return;
    setSectionTitle(e.target.value);
  }

  async function uploadSection() {
    if (!allowUpload) return;

    const newSection = !section
      ? Section(sectionTitle, timestamp)
      : { ...section, title: sectionTitle };

    dispatch(
      setSection({
        projectID,
        section: newSection,
      })
    );

    disableSectionForm();

    if (!section) {
      await addSection(projectID, newSection);
    } else {
      await editSection(projectID, section, sectionTitle);
    }
  }

  return (
    <form className="section-form" data-type={type}>
      <input
        className="section-title-input"
        type="text"
        value={sectionTitle}
        placeholder="Name this section"
        onChange={(e) => {
          handleSectionTitleInput(e);
        }}
      />
      <div className="section-form-buttons">
        <button
          type="button"
          className="cta"
          aria-disabled={!allowUpload}
          onClick={uploadSection}
        >
          {section ? "Save" : "Add section"}
        </button>
        <button
          type="button"
          className="cta-cancel-sm"
          onClick={disableSectionForm}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
