import React from "react";
import { useDraggable } from '@dnd-kit/core';
import deleteIcon from "../assets/trash.png";
import editIcon from "../assets/edit.png";

export default function Task({ task, onDelete, onEdit, isDragging }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className={`task-card ${isDragging ? 'dragging' : ''}`}
        >
            <div style={{"width":"90%"}} {...listeners} {...attributes}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
            </div>
            <div className="task-actions">
                <img 
                    src={deleteIcon} 
                    alt="Delete" 
                    className="icon delete-icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task);
                    }}
                />
                <img 
                    src={editIcon} 
                    alt="Edit" 
                    className="icon edit-icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(task);
                    }}
                />
            </div>
        </div>
    );
}