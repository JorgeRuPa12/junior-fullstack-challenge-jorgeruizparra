using LebenChallenge.Application.DTO;
using LebenChallenge.Domain;

namespace LebenChallenge.Application.UseCases.ChangePriorityTaskUseCase
{
    public interface IChangePriorityTaskUseCase
    {
        Task<TaskItem> ExecuteAsync(int id, PriorityTaskDTO dto);
    }
}
