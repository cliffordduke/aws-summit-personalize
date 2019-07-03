import React from "react";
import { Layer } from "grommet";

interface IToast {
  responsive: boolean;
  modal: boolean;
  position?:
    | "top"
    | "hidden"
    | "bottom"
    | "bottom-left"
    | "bottom-right"
    | "center"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | undefined;
  full?: boolean | "vertical" | "horizontal" | undefined;
}

export const Toast: React.FC<IToast> = ({
  children,
  modal,
  position,
  full,
  ...rest
}) => {
  return (
    <Layer
      position={position || "top"}
      full={full}
      modal={modal}
      margin="none"
      responsive
      plain={modal ? false : true}
      {...rest}
    >
      {children}
    </Layer>
  );
};
