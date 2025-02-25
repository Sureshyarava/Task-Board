import React from "react";
import "./Css/App.css";
import TaskBoard from "./Components/TaskBoard";

export default function App(){
  return (
    <div className="body">
      <h1 id="center">Task board</h1>
      <TaskBoard />
    </div>
  )
}