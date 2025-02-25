import React, { useState, useEffect } from "react";

export default function Form({ status, handleAdd, handleUpdate, editTask, onClose }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        console.log('EditTask changed:', editTask);
        if (editTask) {
            setTitle(editTask.title);
            setDescription(editTask.description);
        }
    }, [editTask]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = {
            title,
            description,
            status,
            id: editTask ? editTask.id : Date.now()
        };

        if (editTask) {
            handleUpdate(taskData);
        } else {
            handleAdd(taskData);
        }

        setTitle('');
        setDescription('');
    }

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
            />
            <div className="form-buttons">
                <button type="submit">
                    {editTask ? 'Update' : 'Submit'}
                </button>
                <button type="button" onClick={onClose}>
                        Cancel
                </button>
            </div>

        </form>
    );
}