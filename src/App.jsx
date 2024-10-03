import { useEffect, useState } from "react";
import "./App.css";
import { FaPlus, FaPencilAlt, FaTrash } from "react-icons/fa";
import {db} from './assets/firebase'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db,'todos'),(snapshot)=>{
      setTodos(snapshot.docs.map((doc)=>({id:doc.id,todo:doc.data().todo})));
    });
    return ()=>unsubscribe();
  }, [])

  /*
  Let's break down this useEffect hook and explain its functionality in detail:
  useEffect Hook:
This hook runs side effects in functional components.
It's called with two arguments: a function and a dependency array.
The empty dependency array [] means this effect runs once when the component mounts.
onSnapshot function:
This is a Firebase Firestore function that listens for real-time updates to a collection.
collection(db,'todos') refers to the 'todos' collection in the Firestore database.
Snapshot listener:
When the snapshot updates, it calls the provided callback function with the new snapshot.
snapshot.docs is an array of all documents in the 'todos' collection.
Mapping documents to todos:
snapshot.docs.map((doc)=>({id:doc.id,todo:doc.data().todo})) transforms each document into a todo object.
For each document, it creates an object with:
id: The document's ID in Firestore.
todo: The 'todo' field from the document's data.
Updating state:
setTodos(...) updates the component's state with the new array of todos.
This causes the component to re-render with the latest data from Firestore.
Unsubscribe function:
onSnapshot returns an unsubscribe function.
This function is stored in the unsubscribe variable.
Cleanup function:
The return ()=>unsubscribe(); part is a cleanup function.
It's called when the component unmounts or before the effect runs again.
It unsubscribes from the Firestore listener, preventing memory leaks.
In summary, this useEffect hook sets up a real-time listener to the 'todos' collection in Firestore. Whenever the collection changes, it updates the component's state with the latest data. It also ensures proper cleanup when the
component unmounts. This allows the todo list to stay synchronized with the Firestore database in real-time.
  */


  const setEdit = (index) => {
    setInput(todos[index].todo);
    setEditIndex(index);
  };
  /*
  explain in detail the functionalities and usage of todos, setTodos, input, setInput in the whole code where these are used. 
  Certainly! Let's break down the functionalities and usage of todos, setTodos, input, and setInput in this React component:
1. todos and setTodos:
const [todos, setTodos] = useState([{id:1, todo:'Learn React'}]);

(todos) is an array of todo objects. Each todo object has an id and a todo property.
setTodos is the function to update the todos state.
Initially, there's one todo item in the array.
Usage in the code:
a. In the addTodo function:
setTodos([...todos, {id: new Date(), todo: input}]);

This adds a new todo item to the array, using the current input value.
b. In the JSX, to render the list of todos:
.todos.length > 0 && (
  // ... 
  {todos.map((todo, index) => (
    <li key={index}>
      <span className="text-lg">{todo.todo}</span>
      // ...
    </li>
  ))}
  // ...
)

This checks if there are any todos and then maps over the todos array to render each todo item.

input and setInput:
const [input, setInput] = useState('');

input is a string that holds the current value of the todo input field.
setInput is the function to update the input state.
Initially, the input is an empty string.
Usage in the code:
a. In the input field:
<input
  type="text"
  placeholder="Add a todo"
  value={input}
  onChange={(e) => setInput(e.target.value)}
/>

The value prop is set to input, creating a controlled component. The onChange event updates input with the current value of the input field.
b. In the addTodo function:
if(input.trim() !== '') {
  setTodos([...todos, {id: new Date(), todo: input}]);
  setInput('');
}

This checks if input is not empty (after trimming whitespace). If it's not empty, it adds a new todo using the input value, then clears the input field by setting it back to an empty string.
In summary:
(todos) and setTodos manage the list of todo items.
input and setInput manage the current value of the todo input field.
These states work together to allow users to add new todos and display the current list of todos.
The component re-renders whenever these states change, ensuring the UI always reflects the current state.
  */

  /*
explain in detail the functionalities and usage of editIndex, setEditIndex, setEdit, updateTodo in the whole code where these are used. 
Certainly! Let's break down the functionalities and usage of editIndex, setEditIndex, setEdit, and updateTodo in this React component:
editIndex and setEditIndex:
const [editIndex, setEditIndex] = useState(-1);

editIndex is a state variable that keeps track of which todo item is currently being edited.
setEditIndex is the function to update the editIndex state.
Initially, it's set to -1, indicating no todo is being edited.
Usage in the code:
a. In the JSX, to determine which action to perform when the button is clicked:
<button onClick={editIndex === -1 ? addTodo : updateTodo} className="...">
  {editIndex === -1 ? <FaPlus/> : <FaPencilAlt/>}
</button>

This checks if editIndex is -1. If it is, it calls addTodo; otherwise, it calls updateTodo. It also changes the button icon based on this condition.
2. setEdit function:
const setEdit = (index) => {
  setInput(todos[index].todo);
  setEditIndex(index);
}

This function is called when the edit button for a todo item is clicked. It does two things:
Sets the input state to the text of the todo being edited.
Sets the editIndex to the index of the todo being edited.
Usage in the code:
<button onClick={() => setEdit(index)} className="..."><FaPencilAlt/></button>

This button, when clicked, calls setEdit with the index of the todo item.
updateTodo function:
const updateTodo = async () => {
  try {
    if (input.trim() !== '') {
      const updatedTodos = [...todos];
      updatedTodos[editIndex].todo = input;
      setTodos(updatedTodos);
      setInput('');
    }
  } catch (error) {
    console.error(error.message);
  }
}

This function is called when the user wants to update an existing todo. It:
Checks if the input is not empty.
Creates a copy of the todos array.
Updates the todo at the editIndex with the new input value.
Sets the updated todos array as the new state.
Clears the input field.
Usage in the code:
It's used in the same button as addTodo, but only when editIndex is not -1:

<button onClick={editIndex === -1 ? addTodo : updateTodo} className="...">
  {editIndex === -1 ? <FaPlus/> : <FaPencilAlt/>}
</button>

In summary:
editIndex and setEditIndex manage which todo item is currently being edited.
setEdit prepares the component for editing a specific todo by setting the input and editIndex.
updateTodo performs the actual update of a todo item in the todos array.
These functions work together to enable the edit functionality in the todo app, allowing users to modify existing todos.
*/

  const addTodo = async () => {
    try {
      if (input.trim() !== "") {
        // setTodos([...todos, { id: new Date(), todo: input }]);
        await addDoc(collection(db,'todos'),{todo:input});
        setInput("");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateTodo = async () => {
    try {
      if (input.trim() !== "") {
        // const updatedTodos = [...todos];
        // updatedTodos[editIndex].todo = input;
        // setTodos(updatedTodos);
        const todoDocRef=doc(db,'todos',todos[editIndex].id);
        await updateDoc(todoDocRef,{todo:input})
        setEditIndex(-1);
        setInput("");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

/*
 Let's break down the updateTodo function and explain its functionality in detail:
 The function is defined as async, allowing the use of await for asynchronous operations.
It starts with a try-catch block to handle any potential errors during the update process.
if (input.trim() !== ""): This checks if the input is not empty after trimming whitespace. This prevents updating a todo with an empty string.
const todoDocRef = doc(db, 'todos', todos[editIndex].id):
This creates a reference to the specific document in the Firestore database.
db is the Firestore database instance.
'todos' is the collection name.
todos[editIndex].id is the ID of the todo item being edited.
await updateDoc(todoDocRef, {todo: input}):
This updates the document in Firestore.
updateDoc is a Firestore function for updating documents.
It takes two arguments: the document reference and an object with the fields to update.
Here, it's updating the todo field with the new input value.
The await keyword ensures that the function waits for this operation to complete before moving on.
setEditIndex(-1):
This resets the editIndex state to -1, indicating that no todo is currently being edited.
setInput(""):
This clears the input field after the update is complete.
If an error occurs during this process, it will be caught in the catch block and logged to the console.
*/


  const removeTodo = async (id) => {
    // let filteredTodos = todos.filter((todo) => todo.id !== id);
    // setTodos(filteredTodos);
    try{
      await deleteDoc(doc(db,'todos',id));
    }catch (error){
      console.error(error.message)
    }
  };

  /*
  Here's a detailed explanation of how removeTodo works:
The function takes an id parameter, which is the unique identifier of the todo item to be removed.
It uses the filter method on the todos array to create a new array (filteredTodos) that includes all todo items except the one with the matching id.
3. The filter condition (todo) => todo.id !== id keeps all todos where the id does not match the one passed to the function.
4. After filtering, setTodos is called with the filteredTodos array, which updates the state with the new array that no longer includes the removed todo item.
The function is defined as async, although it doesn't contain any asynchronous operations. This might be in preparation for future additions like API calls or database operations.
Usage in the code:
The removeTodo function is called when the trash icon button is clicked for a specific todo item:
<button onClick={() => removeTodo(todo.id)} className="p-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded hover:from-red-500 hover:to-red-700 ">
  <FaTrash/>
</button>
When this button is clicked, it calls removeTodo with the id of the corresponding todo item. This triggers the removal process, updating the state and causing the component to re-render without the deleted item.
In summary, removeTodo provides the delete functionality for the todo app, allowing users to remove specific items from their todo list by filtering out the selected item and updating the state accordingly.
  */

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-custom-background bg-center bg-cover">
      <div className="bg-gray-100 p-6 rounded shadow-md w-full max-w-lg lg:w-1/4">
        <h1 className="text-3xl font-bold text-center mb-4">Todo App</h1>
        <div className="flex">
          <input
            type="text"
            placeholder="Add a todo"
            className="py-2 px-4 border rounded w-full focus:outline-none mr-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={editIndex === -1 ? addTodo : updateTodo}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded"
          >
            {editIndex === -1 ? <FaPlus /> : <FaPencilAlt />}
          </button>
        </div>
      </div>

      {todos.length > 0 && (
        <div className="bg-gray-100 p-6 rounded shadow-md w-full max-w-lg lg:w-1/4">
          <ul>
            {todos.map((todo, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-white p-3 rounded shadow-md mb-3"
              >
                <span className="text-lg">{todo.todo}</span>
                <div>
                  <button
                    onClick={() => setEdit(index)}
                    className="mr-2 p-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded hover:from-gray-500 hover:to-gray-700 "
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    onClick={() => removeTodo(todo.id)}
                    className="p-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded hover:from-red-500 hover:to-red-700 "
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
