using LebenChallenge.Application.DTO;
using LebenChallenge.Application.Interfaces;
using LebenChallenge.Domain;

namespace LebenChallenge.Application.UseCases.ChangePriorityTaskUseCase
{
    public class ChangePriorityTaskUseCase:IChangePriorityTaskUseCase
    {
        private readonly ITaskRepository _taskRepository;

        public ChangePriorityTaskUseCase(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        public async Task<TaskItem> ExecuteAsync(int id, PriorityTaskDTO dto)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null)
            {
                throw new Exception("Task not found");
            }

            task.ChangePriority(dto.Priority);
            return await _taskRepository.UpdateAsync(task);
        }
    }
}
