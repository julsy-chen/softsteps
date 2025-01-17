import React from "react";

export function Title() {
  return (
    <>
      <div className="title">
        <textarea 
          placeholder="Untitled To-Do List" 
          id="title"
        />
      </div>
    </>
  );
}