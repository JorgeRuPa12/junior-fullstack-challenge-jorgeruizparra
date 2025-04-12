using LebenChallenge.Application.Interfaces;
using LebenChallenge.Domain;
using LebenChallenge.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace LebenChallenge.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly InMemoryDbContext _context;

    public TaskRepository(InMemoryDbContext inMemoryDbContext)
    {
        _context = inMemoryDbContext;
    }

    public async Task<TaskItem> AddAsync(TaskItem task)
    {
        TaskItem taskItem = new TaskItem(task.Name, task.Description, task.DueDate);
        await _context.Tasks.AddAsync(taskItem);

        await _context.SaveChangesAsync();

        return taskItem;
    }

    public async Task DeleteAsync(int id)
    {
        TaskItem taskItem = await GetByIdAsync(id);
        _context.Tasks.Remove(taskItem);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetAllAsync()
    {
        return await _context.Tasks.ToListAsync();
    }

    public async Task<TaskItem> GetByIdAsync(int id)
    {
        return await _context.Tasks.FirstOrDefaultAsync(z => z.Id == id);
    }

    

    public async Task<TaskItem> UpdateAsync(TaskItem task)
    {
        TaskItem taskItem = await GetByIdAsync(task.Id);
        taskItem.Name = task.Name;
        taskItem.Description = task.Description;
        taskItem.DueDate = task.DueDate;
        taskItem.Priority = task.Priority;
        taskItem.IsCompleted = task.IsCompleted;

        await _context.SaveChangesAsync();

        return taskItem;
    }
}
