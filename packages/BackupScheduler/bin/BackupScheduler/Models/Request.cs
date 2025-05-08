
namespace BackupScheduler.Models
{
    public class Request
    {
        public int requestId { get; set; }
        public float frequencyPerDay { get; set; }
        public string databaseName { get; set; }
        public string databaseUserName { get; set; }
        public string outputPath { get; set; }
    }
}
