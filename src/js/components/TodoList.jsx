import React, { useEffect, useState } from "react";

const TodoList = () => {

    const USER = "jeniffer";
    const API = "https://playground.4geeks.com/todo";

    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");

    // Obtener variables del servidor
    const getTasks = async () => {
        try {
            const response = await fetch(`${API}/users/${USER}`);
            const data = await response.json();

            if (response.status === 404) {
                await createUser();
                return;
            }

            setTasks(data.todos || []);

        } catch (error) {
            console.error("Error obtaining tasks:", error);
        }
    };

  // Crear usuario si no existe
    const createUser = async () => {
        try {
            await fetch(`${API}/users/${USER}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            getTasks();

        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    // Agregar tarea
    const addTask = async () => {
        if (inputValue.trim() === "") return;

        const newTask = {
            label: inputValue,
            is_done: false
        };

        try {
            const response = await fetch(`${API}/todos/${USER}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask)
            });

            if (response.ok) {
                setInputValue("");
                getTasks();
            }

        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Eliminar tarea por el id de la API
    const deleteTask = async (id) => {
        try {
            await fetch(`${API}/todos/${id}`, {
                method: "DELETE"
            });

            getTasks();

        } catch (error) {
            console.error("Error eliminando tarea:", error);
        }
    };

    // Borrar todas las tareas de la lista del servidor 
    const clearAll = async () => {
        try {
            // Eliminar todas las tareas del usuario
            await fetch(`${API}/users/${USER}`, {
                method: "DELETE"
            });

            // Crear el usuario nuevamente vacío
            await createUser();

            // Limpiar visualmente
            setTasks([]);

        } catch (error) {
            console.error("Error clearing all tasks:", error);
        }
    };
    
    // Cargar tareas al empezar
    useEffect(() => {
        getTasks();
    }, []);

   // Manejadores de inputs 
    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    };

    return (
        <div className="todo-container">
            <h1 className="todo-title">TodoList</h1>

            <div className="input-wrapper">
                <input
                    className="todo-input"
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a new task"
                />

                {tasks.length === 0 ? (
                    <p className="empty-message my-3">🚨 There aren't tasks, add new tasks ✍️</p>
                ) : (
                    <ul className="todo-list">
                        {tasks.map((t) => (
                            <li key={t.id} className="todo-item">
                                {t.label}
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteTask(t.id)}
                                >
                                    x
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="task-footer">
                <p className="task-counter">Total task: {tasks.length}</p>
                <button className="deleteTotal-btn" onClick={clearAll}>
                    Clear All Tasks
                </button>
                </div>

            </div>
        </div>
    );
};

export default TodoList;

