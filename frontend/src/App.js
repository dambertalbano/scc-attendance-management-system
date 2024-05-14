import axios from "axios";
import React, { useEffect, useState } from "react";
import List from "./Components/List";
import { baseURL } from "./utils/constant";

const App = () => {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateUI, setUpdateUI] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${baseURL}/get`)
      .then((res) => {
        console.log(res.data);
        setTasks(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks");
        setLoading(false);
      });
  }, [updateUI]);

  const addTask = () => {
    axios.post(`${baseURL}/save`, { task: input })
      .then((res) => {
        console.log(res.data);
        setInput("");
        setUpdateUI((prev) => !prev);
      })
      .catch((error) => {
        console.error("Error adding task:", error);
        setError("Failed to add task");
      });
  };

  return (
    <main>
      <h1 className="title">CRUD OPERATIONS</h1>
      <div className="input_holder">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" onClick={addTask}>
          Add Task
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <List key={task._id} id={task._id} task={task.task} setUpdateUI={setUpdateUI} />
          ))}
        </ul>
      )}
    </main>
  );
};

export default App;
