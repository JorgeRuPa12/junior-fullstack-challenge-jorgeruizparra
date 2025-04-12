using LebenChallenge.Application.DTO;
using LebenChallenge.Application.Interfaces;
using LebenChallenge.Application.UseCases;
using LebenChallenge.Application.UseCases.ChangePriorityTaskUseCase;
using LebenChallenge.Application.UseCases.UpdateTaskUseCase;
using LebenChallenge.Domain;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace LebenChallenge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskItemController : ControllerBase
{
    private readonly ICreateTaskUseCase _createTaskUseCase;
    private readonly IGetAllTasksUseCase _getAllTasksUseCase;
    private readonly ICompleteTaskUseCase _completeTaskUseCase;
    private readonly IGetTaskByIdUseCase _getTaskByIdUseCase;
    private readonly IUpdateTaskUseCase _updateTaskUseCase;
    private readonly IDeleteTaskUseCase _deleteTaskUseCase;
    private readonly IChangePriorityTaskUseCase _changePriorityTaskUseCase;

    public TaskItemController(
        ICreateTaskUseCase createTaskUseCase,
        ICompleteTaskUseCase completeTaskUseCase,
        IGetAllTasksUseCase getAllTasksUseCase,
        IGetTaskByIdUseCase getTaskByIdUseCase,
        IUpdateTaskUseCase updateTaskUseCase,
        IDeleteTaskUseCase deleteTaskUseCase,
        IChangePriorityTaskUseCase changePriorityTaskUseCase

    )
    {
        _createTaskUseCase = createTaskUseCase;
        _completeTaskUseCase = completeTaskUseCase;
        _getAllTasksUseCase = getAllTasksUseCase;
        _getTaskByIdUseCase = getTaskByIdUseCase;
        _updateTaskUseCase = updateTaskUseCase;
        _deleteTaskUseCase = deleteTaskUseCase;
        _changePriorityTaskUseCase = changePriorityTaskUseCase;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tasks = await _getAllTasksUseCase.ExecuteAsync();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        TaskItem task = await _getTaskByIdUseCase.ExecuteAsync(id);
        return Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskDTO dto)
    {
        TaskItem newTaskItem = await _createTaskUseCase.ExecuteAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = newTaskItem.Id }, newTaskItem);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        DeleteTaskDTO taskToDelete = new DeleteTaskDTO
        {
            Id = id
        };
        await _deleteTaskUseCase.ExecuteAsync(taskToDelete);
        return Ok(taskToDelete);
    }

    [HttpPut("{id}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        CompleteTaskDTO taskToCompplete = new CompleteTaskDTO
        {
            Id = id
        };
        await _completeTaskUseCase.ExecuteAsync(taskToCompplete);

        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDTO dto)
    {
        TaskItem updatedTaskItem = await _updateTaskUseCase.ExecuteAsync(id, dto);
        return Ok(updatedTaskItem);
    }

    [HttpPut("{id}/priority")]
    public async Task<IActionResult> ChangePriority(int id, [FromBody] PriorityTaskDTO dto)
    {

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        await _changePriorityTaskUseCase.ExecuteAsync(id, dto);

        return Ok();
    }
}
