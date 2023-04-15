import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLockedBody } from "usehooks-ts";

export interface DropdownProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  refProp: React.Ref<HTMLDivElement>;
}

export interface DropdownButtonProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  value: any;
  refProp: React.MutableRefObject<HTMLButtonElement>;
}

interface DropdownHOCProps {
  Button: (props: any) => JSX.Element;
  ButtonProps?: object;
  Dropdown: (props: any) => JSX.Element;
  DropdownProps?: object;
  isActiveProp?: boolean;
  setIsActiveProp?: React.Dispatch<React.SetStateAction<boolean>>;
  value?: any;
  setValue?: React.Dispatch<React.SetStateAction<any>>;
  DynamicPositioning?: boolean;
}

export function Dropdown({
  Button,
  ButtonProps,
  Dropdown,
  DropdownProps,
  isActiveProp,
  setIsActiveProp,
  value,
  setValue,
  DynamicPositioning = true,
}: DropdownHOCProps) {
  const [isActive, setIsActive] = useState(false);

  const isActiveValue = isActiveProp || isActive;
  const isActiveSetter = setIsActiveProp || setIsActive;

  const [locked, setLocked] = useLockedBody(isActiveValue, "root");

  const dropdownRef = useRef(
    null
  ) as unknown as React.MutableRefObject<HTMLDivElement>;
  const buttonRef = useRef(
    null
  ) as unknown as React.MutableRefObject<HTMLButtonElement>;

  let movement_timer: NodeJS.Timeout | null = null;
  const RESET_TIMEOUT = 100;

  function setDropdownPosition() {
    // If the dynamic positioning property is false, the position properties are static CSS properties

    if (!dropdownRef.current || !buttonRef.current || !DynamicPositioning)
      return;

    function setDropdownAsVisible() {
      // The dataset is used for transitioning the dropdown element when changing its position properties after its first appearance

      setTimeout(() => {
        if (!dropdownRef.current.dataset.visible)
          dropdownRef.current.dataset.visible = "true";
      }, 0);
    }

    const buttonBoundingClientRect = buttonRef.current.getBoundingClientRect();

    const buttonInfo = {
      top: buttonBoundingClientRect.top,
      right: buttonBoundingClientRect.right,
      bottom: buttonBoundingClientRect.bottom,
      left: buttonBoundingClientRect.left,
      XCenter:
        buttonBoundingClientRect.left + buttonBoundingClientRect.width / 2,
      YCenter:
        buttonBoundingClientRect.top + buttonBoundingClientRect.height / 2,
    };

    const topSpace = buttonInfo.top;
    const rightSpace = window.innerWidth - buttonInfo.right;
    const bottomSpace = window.innerHeight - buttonInfo.bottom;
    const leftSpace = buttonInfo.left;

    if (
      bottomSpace >= dropdownRef.current.offsetHeight ||
      topSpace >= dropdownRef.current.offsetHeight
    ) {
      const dropdownLeft =
        buttonInfo.XCenter - dropdownRef.current.offsetWidth / 2;
      const dropdownRight =
        buttonInfo.XCenter + dropdownRef.current.offsetWidth / 2;
      let x;

      if (dropdownLeft < 8 && dropdownRight <= window.innerWidth - 8) {
        x = 8 + "px";
      } else if (dropdownRight > window.innerWidth - 8) {
        x = dropdownLeft - (dropdownRight - (window.innerWidth - 8)) + "px";
      } else {
        x = dropdownLeft + "px";
      }

      if (bottomSpace >= dropdownRef.current.offsetHeight * 0.7) {
        if (dropdownRef.current.offsetHeight <= bottomSpace)
          dropdownRef.current.style.height = (bottomSpace - 10).toString();

        const y = (buttonInfo.bottom + 5).toString() + "px";

        dropdownRef.current.style.setProperty("--x", x);
        dropdownRef.current.style.setProperty("--y", y);
        dropdownRef.current.style.height = "";
        if (bottomSpace < dropdownRef.current.offsetHeight)
          dropdownRef.current.style.height = bottomSpace - 8 + "px";

        setDropdownAsVisible();

        return;
      }

      if (topSpace >= dropdownRef.current.offsetHeight * 0.7) {
        if (dropdownRef.current.offsetHeight <= topSpace)
          dropdownRef.current.style.height = (topSpace - 10).toString();

        const y =
          (buttonInfo.top - (dropdownRef.current.offsetHeight + 5)).toString() +
          "px";

        dropdownRef.current.style.setProperty("--x", x);
        dropdownRef.current.style.setProperty("--y", y);
        dropdownRef.current.style.height = "";
        if (topSpace < dropdownRef.current.offsetHeight)
          dropdownRef.current.style.height = topSpace - 8 + "px";

        setDropdownAsVisible();
      }

      return;
    }

    if (rightSpace >= dropdownRef.current.offsetWidth) {
      const x = (buttonInfo.right + 5).toString() + "px";
      const y =
        (buttonInfo.YCenter - dropdownRef.current.offsetHeight / 2).toString() +
        "px";

      dropdownRef.current.style.setProperty("--x", x);
      dropdownRef.current.style.setProperty("--y", y);

      setDropdownAsVisible();

      return;
    }

    if (leftSpace >= dropdownRef.current.offsetWidth) {
      const x =
        (buttonInfo.left - (dropdownRef.current.offsetWidth + 5)).toString() +
        "px";
      const y =
        (buttonInfo.YCenter - dropdownRef.current.offsetHeight / 2).toString() +
        "px";

      dropdownRef.current.style.setProperty("--x", x);
      dropdownRef.current.style.setProperty("--y", y);

      setDropdownAsVisible();
    }
  }

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (movement_timer !== null) clearInterval(movement_timer);
      movement_timer = setTimeout(setDropdownPosition, RESET_TIMEOUT);
    });

    return () => {
      window.removeEventListener("resize", () => {
        if (movement_timer !== null) clearInterval(movement_timer);
        movement_timer = setTimeout(setDropdownPosition, RESET_TIMEOUT);
      });
    };
  }, []);

  useEffect(() => {
    setDropdownPosition();
  }, [isActiveValue]);

  return (
    <>
      <Button
        isActive={isActiveValue}
        setIsActive={isActiveSetter}
        value={value}
        refProp={buttonRef}
        {...ButtonProps}
      />

      {isActiveValue &&
        createPortal(
          <div
            className="dropdown-overlay"
            onClick={(e) => {
              e.stopPropagation();
              isActiveSetter(false);
            }}
          ></div>,
          document.body
        )}

      {isActiveValue &&
        createPortal(
          <Dropdown
            isActive={isActiveValue}
            setIsActive={isActiveSetter}
            setValue={setValue}
            value={value}
            refProp={dropdownRef}
            {...DropdownProps}
          />,
          document.body
        )}
    </>
  );
}
