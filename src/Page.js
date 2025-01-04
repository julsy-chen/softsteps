import React from "react";

import { Title } from "./Title";
import { TaskListContainer } from "./TaskListContainer";
import { TrashCan } from "./TrashCan";

export function Page() {
    return (
      <>
        <Title />
        <TaskListContainer /> 
        <TrashCan /> 
      </>
    );
}