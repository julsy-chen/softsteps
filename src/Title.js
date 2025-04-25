import React, { useState, useEffect } from "react";
import { 
  db, 
  getTitleBackend, 
  updateTitleBackend 
} from "./firebase";

export function Title() {
  const [title, setTitle] = useState("");

  // Fetch title when component mounts
  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const savedTitle = await getTitleBackend(db); // gets the title stored in the database
        setTitle(savedTitle); // sets title to be the one saved in the database so that the saved title is displayed in the textbox 
      } catch (error) {
        console.error("Error fetching title:", error);
      }
    };
    fetchTitle();
  }, []);

  const handleTitleChange = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle); // useState to change the value of title so that the value can be udpated
    
    try {
      await updateTitleBackend(db, newTitle); // calls function in firebase.js - to update the title 
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  return (
    <>
      <div className="title">
        <textarea 
          placeholder="Untitled To-Do List" // what is shown in place of the title when the user hasn't inputted anything 
          id="title"
          value={title} // updating the textbox to show what the user has inputted
          onChange={handleTitleChange}
        />
      </div>
    </>
  );
}