using System;
using BackupScheduler.Interfaces;

namespace BackupScheduler.Models
{
    public class OnCompleteCallback : ICallback<string>
    {
        public void onSuccess(string data)
        {
            Console.WriteLine(data);
        }

        public void onFailure(Exception e)
        {

        }
    }
}
