using System.ComponentModel.DataAnnotations;

namespace LebenChallenge.Application.DTO
{
    public struct PriorityTaskDTO
    {
        [Range(1, 5, ErrorMessage = "La prioridad debe ser un número entre 1 y 5.")]
        public int Priority { get; set; }
    }
}
