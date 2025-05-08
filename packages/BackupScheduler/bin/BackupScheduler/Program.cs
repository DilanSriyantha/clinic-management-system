using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.IO;
using System.Reflection;
using BackupScheduler.Models;
using BackupScheduler.Interfaces;
using d_logger;
using Microsoft.Win32.TaskScheduler;

namespace BackupScheduler
{
    public class Program
    {
        private static string BACKUP_BATCH_PATH = Path.GetDirectoryName(
            Assembly.GetExecutingAssembly().Location) + "\\backup.bat";

        static void Main(string[] args)
        {
            var rand = new Random();

            Request req = new Request();
            req.requestId = rand.Next(101);

            Console.Write("Enter the frequency per day : ");
            req.frequencyPerDay = float.Parse(Console.ReadLine());

            Console.Write("Enter the database name : ");
            req.databaseName = Console.ReadLine();

            Console.Write("Enter the database user name : ");
            req.databaseUserName = Console.ReadLine();

            Console.Write("Enter the output dir : ");
            req.outputPath = Console.ReadLine();


        }

        private static async System.Threading.Tasks.Task InitiateScheduling(Request req)
        {
            try
            {
                await ScheduleTask(req);
            }
            catch (Exception e)
            {
                Log.Write(Log.MessageType.ERROR, e.Message);
            }
        }

        private static async System.Threading.Tasks.Task ScheduleTask(Request req, ICallback<string> callback)
        {
            await System.Threading.Tasks.Task.Run(() =>
            {
                using(TaskService ts = new TaskService())
                {
                    TaskDefinition td = ts.NewTask();

                    td.RegistrationInfo.Author = "Dynamite Inc.";
                    td.RegistrationInfo.Description = "CMS_Bacup_Task";

                    TimeTrigger tt = new TimeTrigger
                    {
                        StartBoundary = DateTime.Now,
                        Repetition = new RepetitionPattern(TimeSpan.FromMinutes(1), TimeSpan.Zero)
                    };

                    td.Triggers.Add(tt);

                    string destinationPath = Path.GetFullPath(req.outputPath).Replace(@"\", @"\\");

                    ExecAction ea = new ExecAction(BACKUP_BATCH_PATH, $"\"{req.databaseUserName}\" \"{req.databaseName}\"", null);
                    td.Actions.Add(ea);

                    var folder = ts.GetFolder("CMS by PPAG7");
                    if(folder != null)
                    {
                        var tasks = folder.GetTasks();
                        foreach(var task in tasks)
                        {
                            if(task.Name.Equals("CMS Data Backup"))
                            {
                                task.Dispose();
                                folder.RegisterTaskDefinition("CMS Data Backup", td).Run();
                            }
                        }
                    }
                    else
                    {
                        ts.RootFolder.CreateFolder("CMS by PPAG7").RegisterTaskDefinition("CMS Data Backup", td).Run();
                    }
                    callback.onSuccess("Task scheduled successfully");
                }
            });
        }
    }
}
