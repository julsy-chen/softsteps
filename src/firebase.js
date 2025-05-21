// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    doc, 
    deleteDoc, 
    updateDoc,
    addDoc,
    getDoc,
    setDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

async function getTitleBackend(db) {
    try {
        const settingsRef = doc(db, "settings", "app");
        const settingsDoc = await getDoc(settingsRef);

        if (settingsDoc.exists()) {
            return settingsDoc.data().title ?? "";
        }

        // If no settings document exists, create one with default title
        await setDoc(settingsRef, { title: "" });
        return ""; // <-- important to return default value
    } catch (error) {
        console.error("Error getting title:", error);
        return ""; // <-- fallback to avoid undefined
    }
}

async function updateTitleBackend(db, newTitle) {
    try {
        const settingsRef = doc(db, "settings", "app");
        await setDoc(settingsRef, { title: newTitle }, { merge: true });
        return true;
    } catch (error) {
        console.error("Error updating title:", error);
        return false;
    }
}

async function getTasksBackend(db) {
    try {
        const mainTask = await getDocs(collection(db, "todos"));
        const mainTaskList = await Promise.all(mainTask.docs.map(async doc => {
            // Get subtasks collection for this task
            const subtasksSnapshot = await getDocs(collection(db, "todos", doc.id, "subtasks"));
            const subtasks = subtasksSnapshot.docs.map(subtaskDoc => ({
                subtaskId: subtaskDoc.id,
                subtaskAction: subtaskDoc.data().subtaskAction,
                checkboxState: subtaskDoc.data().checkboxState || false,
                order: subtaskDoc.data().order || 0
            }));

            // Sort subtasks by order
            const sortedSubtasks = subtasks.sort((a, b) => a.order - b.order);

            return {
                id: doc.id,
                taskAction: doc.data().taskInput,
                checkboxState: doc.data().checkboxState || false,
                subtasks: sortedSubtasks,
                order: doc.data().order || 0
            };
        }));
        // Sort tasks by order
        return mainTaskList.sort((a, b) => a.order - b.order);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}

async function deleteTasksBackend(db, taskIds) {
    try {
        // Delete each task and its subtasks from Firebase
        for (const taskId of taskIds) {
            const taskRef = doc(db, "todos", taskId);
            
            // Delete all subtasks in the subcollection first
            const subtasksSnapshot = await getDocs(collection(taskRef, "subtasks"));
            const deletionPromises = subtasksSnapshot.docs.map(subtaskDoc => 
                deleteDoc(doc(db, "todos", taskId, "subtasks", subtaskDoc.id))
            );
            await Promise.all(deletionPromises);
            
            // Then delete the main task document
            await deleteDoc(taskRef);
        }
        return true;
    } catch (error) {
        console.error("Error deleting tasks:", error);
        return false;
    }
}

async function updateTaskInputBackend(db, taskId, taskInput) {
    try {
        const taskRef = doc(db, "todos", taskId);
        await updateDoc(taskRef, {
            taskInput: taskInput
        });
        return true;
    } catch (error) {
        console.error("Error updating task input:", error);
        return false;
    }
}

async function updateTaskOrderBackend(db, taskId, newOrder) {
    try {
        const taskRef = doc(db, "todos", taskId);
        await updateDoc(taskRef, {
            order: newOrder
        });
        return true;
    } catch (error) {
        console.error("Error updating task order:", error);
        return false;
    }
}

async function addSubtaskToTask(db, taskId, subtaskAction) {
    try {
        // Create a reference to the subtasks subcollection
        const subtasksRef = collection(db, "todos", taskId, "subtasks");
        
        // Get current subtasks to determine the next order
        const subtasksSnapshot = await getDocs(subtasksRef);
        const nextOrder = subtasksSnapshot.size;
        
        // Add new subtask document to the subcollection
        const docRef = await addDoc(subtasksRef, {
            subtaskAction: subtaskAction,
            checkboxState: false,
            order: nextOrder
        });
        
        return {
            success: true,
            subtaskId: docRef.id,
            subtask: {
                subtaskAction,
                checkboxState: false,
                order: nextOrder
            }
        };
        
    } catch (error) {
        console.error("Error adding subtask:", error);
        return { success: false };
    }
}

async function deleteSubtaskFromTask(db, taskId, subtaskIds) {
    try {
        for (const subtaskId of subtaskIds) {
            await deleteDoc(doc(db, "todos", taskId, "subtasks", subtaskId)); // Delete the subtask document from the subcollection
        }
        return true;

    } catch (error) {
        console.error("Error deleting subtask:", error);
        return false;
    }
}

async function updateSubtaskInput(db, taskId, subtaskId, subtaskAction) {
    try {
        const subtaskRef = doc(db, "todos", taskId, "subtasks", subtaskId);
        
        await updateDoc(subtaskRef, {
            subtaskAction: subtaskAction
        });
        
        return true;
    } catch (error) {
        console.error("Error updating subtask input:", error);
        console.error("Error details:", {
            taskId,
            subtaskId,
            subtaskAction,
            errorMessage: error.message
        });
        return false;
    }
}

async function updateSubtaskOrderBackend(db, taskId, subtaskId, newOrder) {
    try {
        const taskRef = doc(db, "todos", taskId, "subtasks", subtaskId);
        await updateDoc(taskRef, {
            order: newOrder
        });
        return true;
    } catch (error) {
        console.error("Error updating subtask order:", error);
        return false;
    }
}

async function updateSubtaskCompleted(db, taskId, subtaskId, completed) {
    try {
        const subtaskRef = doc(db, "todos", taskId, "subtasks", subtaskId);
        await updateDoc(subtaskRef, { 
            checkboxState: completed 
        });
        return true;
    } catch (error) {
        console.error("Error updating subtask completion state:", error);
        return false;
    }
}

async function updateTaskCompleted(db, taskId, completed) {
    try {
        const taskRef = doc(db, "todos", taskId);
        await updateDoc(taskRef, { 
            checkboxState: completed 
        });
        return true;
    } catch (error) {
        console.error("Error updating task completion state:", error);
        return false;
    }
}

export { 
    db, 
    getTasksBackend, 
    deleteTasksBackend,
    updateTaskInputBackend,
    updateTaskOrderBackend,
    addSubtaskToTask,
    deleteSubtaskFromTask,
    updateSubtaskInput,
    updateSubtaskOrderBackend,
    getTitleBackend,
    updateTitleBackend,
    updateSubtaskCompleted,
    updateTaskCompleted
};