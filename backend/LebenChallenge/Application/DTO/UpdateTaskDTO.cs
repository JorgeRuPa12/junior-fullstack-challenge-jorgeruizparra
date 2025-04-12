namespace LebenChallenge.Application.DTO
{
    public struct UpdateTaskDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
    }
}
