export const geTasksFromApi = async () => {
    const response = await fetch('https://localhost:7242/api/TaskItem');

    if (!response.ok) {
      throw new Error('Error al obtener las tareas desde la API.');
    }
  
    return response.json();
};

export const geTaskByIdFromApi = async (id: number) => {
  const response = await fetch(`https://localhost:7242/api/TaskItem/${id}`);

  if (!response.ok) {
    throw new Error('Error al obtener la tarea por su ID desde la API.');
  }

  return response.json();
};

export const completeTaskFromApi = async (id: number) => {
  const response = await fetch(`https://localhost:7242/api/TaskItem/${id}/complete`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Error al completar la tarea.');
  }

  return response.ok;
};

export const updatePriorityTaskFromApi = async (id: number, priority: number) => {
  const response = await fetch(`https://localhost:7242/api/TaskItem/${id}/priority`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priority: priority }),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la prioridad de la tarea.');
  }

  return response.ok;
};

export const createTaskFromApi = async (name: string, description: string, date: Date) => {
  const response = await fetch(`https://localhost:7242/api/TaskItem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: name, description: description, dueDate: date }),
  });

  if (!response.ok) {
    throw new Error('Error al crear la tarea.');
  }

  return response.ok;
};

export const deleteTaskFromApi = async (id: number) => {
  const response = await fetch(`https://localhost:7242/api/TaskItem/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la tarea.');
  }

  return response.ok;
};

export const updateTaskFromApi = async (id: number, name: string, description: string, date: Date) => {
  const response = await fetch(`https://localhost:7242/api/TaskItem/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: name, description: description, dueDate: date }),
  });

  if (!response.ok) {
    throw new Error('Error al editar la tarea.');
  }

  return response.ok;
};