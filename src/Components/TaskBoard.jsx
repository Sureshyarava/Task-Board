import React, { useEffect, useState } from "react";
import { DndContext, closestCorners, DragOverlay, useDroppable } from '@dnd-kit/core';
import Form from "./Form.jsx"
import Task from "./Task.jsx";
import addIcon from "../assets/add.png";
import "../Css/TaskBoard.css"

export default function TaskBoard() {
    const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem("tasks") || "[]"));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [status, setStatus] = useState("");
    const [editTask, setEditTask] = useState(null);
    const [activeId, setActiveId] = useState(null);

    function DroppableColumn({ id, title, onAdd, children }) {
        const { setNodeRef } = useDroppable({
            id: id,
        });
    
        return (
            <div ref={setNodeRef} className={`${id} column`}>
                <div className="column-header">
                    <h2>{title}</h2>
                    <img 
                        src={addIcon} 
                        alt="Add" 
                        className="icon add-icon"
                        onClick={onAdd}
                    />
                </div>
                {children}
            </div>
        );
    }

    const handleDelete = (taskToDelete) => {
        console.log('Deleting task:', taskToDelete);
        setTasks(tasks.filter(task => task.id !== taskToDelete.id));
    }

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setTasks(tasks.map(task => {
                if (task.id === active.id) {
                    return { ...task, status: over.id };
                }
                return task;
            }));
        }
        setActiveId(null);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const handleEdit = (taskToEdit) => {
        console.log('Editing task:', taskToEdit);
        setEditTask(taskToEdit);
        setStatus(taskToEdit.status);
        setIsFormOpen(true);
    };

    const handleUpdate = (updatedTask) => {
        setTasks(prev => prev.map(task => 
            task.id === updatedTask.id ? updatedTask : task
        ));
        setIsFormOpen(false);
        setEditTask(null);
    };

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks])

    const handleForm = (status) => {
        setStatus(status);
        setIsFormOpen(prev => !prev);
    }

    const handleAdd = (newTask) => {
        setTasks(prev => [...prev, newTask]);
        setIsFormOpen(false);
    }

    const TasksList = ({status}) => (
        <div className="tasks-container">
            {tasks
                .filter(task => task.status === status)
                .map(task => (
                    <Task 
                        key={task.id} 
                        task={task} 
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        isDragging={activeId === task.id}
                    />
                ))
            }
        </div>
    );

    const columns = [
        { id: "backlog", title: "Backlog" },
        { id: "progress", title: "In Progress" },
        { id: "completed", title: "Completed" }
    ];

    return (
        <>
            {!isFormOpen ? (
                <DndContext
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                >
                    <div className="grid">
                        {columns.map(column => (
                            <DroppableColumn 
                                key={column.id} 
                                id={column.id}
                                title={column.title}
                                onAdd={() => handleForm(column.id)}
                            >
                                <TasksList status={column.id} />
                            </DroppableColumn>
                        ))}
                    </div>
                    <DragOverlay>
                        {activeId ? (
                            <Task 
                                task={tasks.find(task => task.id === activeId)}
                                isDragging
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            ) : (
                <Form 
                    status={status} 
                    handleAdd={handleAdd} 
                    editTask={editTask}
                    handleUpdate={handleUpdate}
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditTask(null);
                    }}
                />
            )}
        </>
    );
}

