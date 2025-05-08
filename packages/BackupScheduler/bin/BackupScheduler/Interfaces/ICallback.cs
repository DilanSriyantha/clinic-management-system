using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackupScheduler.Interfaces
{
    public interface ICallback<T>
    {
        void onSuccess(T data);
        void onFailure(Exception e);
    }
}
