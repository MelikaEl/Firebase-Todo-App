import "./App.css";

function App() {
  return (
   <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-custom-background bg-center bg-cover">
    <div className="bg-gray-100 p-6 rounded shadow-md w-full max-w-lg lg:w-1/4">
      <h1 className="text-3xl font-bold text-center mb-4">Todo App</h1>
      <div className="flex">
        <input
        type="text"
        placeholder="Add a todo"
        className="py-2 px-4 border rounded w-full focus:outline-none mr-2"
        />
        <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded">
          Add
        </button>
      </div>
    </div>

    <div className="bg-gray-100 p-6 rounded shadow-md w-full max-w-lg lg:w-1/4">
      List
    </div>
   </div>
   
  );
}

export default App;
