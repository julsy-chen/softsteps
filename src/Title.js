import React, { useState, useEffect } from "react";
import { db, getTitleBackend, updateTitleBackend } from "./firebase";

export function Title() {
  const [title, setTitle] = useState("");

  // Fetch title when component mounts
  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const savedTitle = await getTitleBackend(db);
        setTitle(savedTitle);
      } catch (error) {
        console.error("Error fetching title:", error);
      }
    };
    fetchTitle();
  }, []);

  const handleTitleChange = async (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
    
    try {
      await updateTitleBackend(db, newTitle);
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  return (
    <>
      <div className="title">
        <textarea 
          placeholder="Untitled To-Do List" 
          id="title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
    </>
  );
}