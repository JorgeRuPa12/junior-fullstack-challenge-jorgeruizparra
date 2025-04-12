using LebenChallenge.Application.Interfaces;
using LebenChallenge.Application.UseCases;
using LebenChallenge.Application.UseCases.ChangePriorityTaskUseCase;
using LebenChallenge.Application.UseCases.UpdateTaskUseCase;
using LebenChallenge.Infrastructure.Persistence;
using LebenChallenge.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAllOrigins", 
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()
    );
});

builder.Services.AddDbContext<InMemoryDbContext>(options =>
    options.UseInMemoryDatabase("LebenChallengeDb")
);

builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<IGetAllTasksUseCase, GetAllTasksUseCase>();
builder.Services.AddScoped<IGetTaskByIdUseCase, GetTaskByIdUseCase>();
builder.Services.AddScoped<ICompleteTaskUseCase, CompleteTaskUseCase>();
builder.Services.AddScoped<ICreateTaskUseCase, CreateTaskUseCase>();
builder.Services.AddScoped<IDeleteTaskUseCase, DeleteTaskUseCase>();
builder.Services.AddScoped<IUpdateTaskUseCase, UpdateTaskUseCase>();
builder.Services.AddScoped<IChangePriorityTaskUseCase, ChangePriorityTaskUseCase>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAllOrigins");
app.UseHttpsRedirection();

app.MapControllers();

app.Run();
