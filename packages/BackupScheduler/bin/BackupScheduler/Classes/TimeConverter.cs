using System;

namespace BackupScheduler.Classes
{
    public static class TimeConverter
    {
        public static string GetTimestamp(DateTime dateTime)
        {
            return dateTime.ToString("yyyyMMddHHmmssffff");
        }
    }
}
