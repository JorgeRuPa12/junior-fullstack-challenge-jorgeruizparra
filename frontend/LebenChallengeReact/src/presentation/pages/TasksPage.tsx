import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { Task } from "../../domain/entities/Task";
import { TaskRepositoryImpl } from "../../infraestructure/api/TaskRepositoryImpl";
import { GetTasks } from "../../application/usecases/GetTasks";
import { GetTaskById } from "../../application/usecases/GetTaskById";
import { CompleteTask } from "../../application/usecases/CompleteTask";
import { CreateTask } from "../../application/usecases/CreateTask";
import { UpdatePriorityTask } from "../../application/usecases/UpdatePriorityTask";
import { DeleteTask } from "../../application/usecases/DeleteTask";
import { UpdateTask } from "../../application/usecases/UpdateTask";

const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Inyeccion de dependencias
    const taskRepo = new TaskRepositoryImpl();
    const getTasksUseCase = new GetTasks(taskRepo);
    const MySwal = withReactContent(Swal);

    const getTaskByIdUseCase = new GetTaskById(taskRepo);
    const completeTaskUseCase = new CompleteTask(taskRepo);
    const createTaskUseCase = new CreateTask(taskRepo);
    const updatePriorityTaskUseCase = new UpdatePriorityTask(taskRepo);
    const deleteTaskUseCase = new DeleteTask(taskRepo);
    const updateTaskUseCase = new UpdateTask(taskRepo);

    const reloadTasks = async () => {
      getTasksUseCase.execute()
          .then((data) => {const sortedTasks = data.sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) {
              return a.isCompleted ? 1 : -1;
            }
            return b.priority - a.priority;
          });
          setTasks(sortedTasks);
          })
          .catch(err => setError(err.message))
    };

    const handleCreateTask = async () => {
      const { value: formValues } = await MySwal.fire({
        title: 'Crear tarea',
        html: `
          <input id="swal-input-name" class="swal2-input" placeholder="Nombre">
          <input id="swal-input-description" class="swal2-input" placeholder="Descripción">
          <input id="swal-input-date" type="datetime-local" class="swal2-input">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        customClass: {
          container: 'dark-theme',
          popup: 'dark-popup',
          title: 'dark-title',
          input: 'dark-input',
          confirmButton: 'dark-button',
          cancelButton: 'dark-button'
        },
        preConfirm: () => {
          const name = (document.getElementById('swal-input-name') as HTMLInputElement).value;
          const description = (document.getElementById('swal-input-description') as HTMLInputElement).value;
          const dueDate = (document.getElementById('swal-input-date') as HTMLInputElement).value;
    
          if (!name || !description || !dueDate) {
            Swal.showValidationMessage('Todos los campos son obligatorios');
            return;
          }
    
          return { name, description, dueDate };
        }
      });

      if (formValues) {
        console.log("Tarea creada: " + formValues);
        console.log(formValues.dueDate)
        await createTaskUseCase.execute(formValues.name, formValues.description, formValues.dueDate);
        reloadTasks();
      
      }
    }

    const handleEditTask = async (id: number) => {
      const taskToEdit = tasks.find(t => t.id === id);
      if (!taskToEdit) return;
    
      const { value: formValues } = await MySwal.fire({
        title: 'Editar tarea',
        html: `
          <input id="swal-input-name" class="swal2-input" placeholder="Nombre" value="${taskToEdit.name}">
          <input id="swal-input-description" class="swal2-input" placeholder="Descripción" value="${taskToEdit.description}">
          <input id="swal-input-date" type="datetime-local" class="swal2-input" value="${taskToEdit.dueDate}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        customClass: {
          container: 'dark-theme',
          popup: 'dark-popup',
          title: 'dark-title',
          input: 'dark-input',
          confirmButton: 'dark-button',
          cancelButton: 'dark-button'
        },
        preConfirm: () => {
          const name = (document.getElementById('swal-input-name') as HTMLInputElement).value;
          const description = (document.getElementById('swal-input-description') as HTMLInputElement).value;
          const dueDate = (document.getElementById('swal-input-date') as HTMLInputElement).value;
    
          if (!name || !description || !dueDate) {
            Swal.showValidationMessage('Todos los campos son obligatorios');
            return;
          }
          return { name, description, dueDate };
        }
      });
    
      if (formValues) {
        console.log('Datos editados:', formValues);
        await updateTaskUseCase.execute(id, formValues.name, formValues.description, formValues.dueDate);
        reloadTasks();
      }
    };

    const handleUpdatePriorityTask = async (id: number) => {
      const { value: formValues } = await MySwal.fire({
        title: 'Cambiar Prioridad',
        html: `
          <select id="swal-input-priority" class="swal2-input">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        customClass: {
          container: 'dark-theme',
          popup: 'dark-popup',
          title: 'dark-title',
          input: 'dark-input',
          confirmButton: 'dark-button',
          cancelButton: 'dark-button'
        },
        preConfirm: () => {
          const priority = (document.getElementById('swal-input-priority') as HTMLInputElement).value;
    
          if (!priority) {
            Swal.showValidationMessage('Este campo es obligatorio');
            return;
          }
          reloadTasks();
          return { priority };
        }
      });

      if (formValues) {
        try {
          await updatePriorityTaskUseCase.execute(id, formValues.priority); // ⬅️ Esperamos aquí
          await reloadTasks();                   // ⬅️ Luego recargamos
          Swal.fire({
            icon: "success",
            title: "Prioridad Actualizada",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'dark-popup',
              title: 'dark-title',
            }
          });
        } catch (error: unknown) {
          let errorMessage = "Ocurrió un error inesperado";

          if (error instanceof Error) {
            errorMessage = error.message;
          }
          Swal.fire({
            icon: "error",
            title: "Error al completar la tarea",
            text: errorMessage || "Algo salió mal.",
            customClass: {
              popup: 'dark-popup',
              title: 'dark-title',
            }
          });
        }
      }
    }

    const handleDeleteTask = async (id: number) => {
      const result = await Swal.fire({
          icon: "info",
          title: "¿Quieres Eliminar esta tarea?",
          text: "Si la eliminas no habra vuelta atrás",
          showCancelButton: true,
          confirmButtonText: "Eliminar",
          customClass: {
            container: 'dark-theme',
            popup: 'dark-popup',
            title: 'dark-title',
            input: 'dark-input',
            confirmButton: 'dark-button',
            cancelButton: 'dark-button'
          }
        })
        if (result.isConfirmed) {
          try {
            await deleteTaskUseCase.execute(id); // ⬅️ Esperamos aquí
            await reloadTasks();                   // ⬅️ Luego recargamos
            Swal.fire({
              icon: "success",
              title: "Tarea Eliminada",
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                popup: 'dark-popup',
                title: 'dark-title',
              }
            });
          } catch (error: unknown) {
            let errorMessage = "Ocurrió un error inesperado";
  
            if (error instanceof Error) {
              errorMessage = error.message;
            }
            Swal.fire({
              icon: "error",
              title: "Error al completar la tarea",
              text: errorMessage || "Algo salió mal.",
              customClass: {
                popup: 'dark-popup',
                title: 'dark-title',
              }
            });
          }
        }
      
    }

    useEffect(() => {
      reloadTasks();
      }, []);

    const handleTaskClick = (id: number) => {
      getTaskByIdUseCase.execute(id)
      .then((data) => {
        MySwal.fire({
          html: `
            <div className="mt-8 p-6 border border-gray-300 rounded-lg">
                <h2 className="text-xl font-semibold">Detalles de la tarea</h2>
                <p><strong>Nombre:</strong> ${data.name}</p>
                <p><strong>Descripción:</strong> ${data.description}</p>
                <p><strong>Fecha de vencimiento:</strong> ${new Date(data.dueDate).toLocaleString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}</p>
                <p><strong>Prioridad:</strong> ${data.priority}</p>
                <p><strong>Completada:</strong> ${data.isCompleted ? "Sí" : "No"}</p>
            </div>
          `,
          showConfirmButton: false,
          showCloseButton: true,
          confirmButtonText: 'Guardar',
          customClass: {
            container: 'dark-theme',
            popup: 'dark-popup',
            title: 'dark-title',
            input: 'dark-input',
            confirmButton: 'dark-button',
            cancelButton: 'dark-button'
          }
        });
      })
      .catch(err => setError(err.message));
    };

    const handleCompleteTask = async (id: number) => {
      const result = await Swal.fire({
        icon: "info",
        title: "¿Quieres completar esta tarea?",
        text: "Una vez completada no podrás editarla",
        showCancelButton: true,
        confirmButtonText: "Completar",
        customClass: {
          container: 'dark-theme',
          popup: 'dark-popup',
          title: 'dark-title',
          input: 'dark-input',
          confirmButton: 'dark-button',
          cancelButton: 'dark-button'
        }
      });
    
      if (result.isConfirmed) {
        try {
          await completeTaskUseCase.execute(id); 
          await reloadTasks();                   
          Swal.fire({
            icon: "success",
            title: "Tarea completada",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'dark-popup',
              title: 'dark-title',
            }
          });
        } catch (error: unknown) {
          let errorMessage = "Ocurrió un error inesperado";

          if (error instanceof Error) {
            errorMessage = error.message;
          }
          Swal.fire({
            icon: "error",
            title: "Error al completar la tarea",
            text: errorMessage || "Algo salió mal.",
            customClass: {
              popup: 'dark-popup',
              title: 'dark-title',
            }
          });
        }
      }
    };

    if (error) {
        return <p>Error: {error}</p>
    };

    //Comprobar si las tareas estan vacias
    if (tasks.length === 0) {
      return (
        <div>
          <p>Añade una tarea para comenzar</p>
          <button className="btnAddTask" onClick={() => handleCreateTask()}>
            ➕ Añade una tarea
          </button>
        </div>
      );
    }

    return (
        <div>
          <button className="btnAddTask" onClick={() => handleCreateTask()}>➕ Añade una tarea</button>
          <table className="table-tasks">
            <thead>
              <tr className="table-tasks-head">
                <th>Nombre</th>
                <th>Fecha de vencimiento</th>
                <th>Prioridad</th>
                <th>¿Completada?</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>
                    <button onClick={() => handleTaskClick(task.id)} >
                      {task.name}
                    </button>
                  </td>
                  <td>
                    {new Date(task.dueDate).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </td>
                  <td><a href="#" onClick={() => handleUpdatePriorityTask(task.id)}>{task.priority}</a></td>
                  <td>
                  {task.isCompleted ? (
                      '🟢'
                    ) : (
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        🔴
                      </button>
                    )}
                  </td>
                  <td>
                      {task.isCompleted ? (
                      ''
                    ) : (
                      <button
                        onClick={() => handleEditTask(task.id)}
                      >
                        ✏️
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}

export default TasksPage;