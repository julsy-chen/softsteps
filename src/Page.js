import React from "react";
import { useState } from "react";

import { Title } from "./Title";
import { TaskListContainer } from "./TaskListContainer";
import { TrashCan } from "./TrashCan";

export function Page({ isSelected, handleClickDraggableHandle }) {

  return (
    <>
      <div className="page">
        <Title />
        <TaskListContainer
          isSelected={isSelected}
          handleClickDraggableHandle={handleClickDraggableHandle} />
        <TrashCan />
      </div>
    </>
  );
}