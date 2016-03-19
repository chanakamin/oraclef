using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Oracle.Models
{
    public class returnType
    {
        public int status { get; set; }
        public object data { get; set; }
        public string  reason { get; set; }

        public returnType(object data = null, int status = 200, string reason = "" )
        {
            this.status = status;
            this.data = data;
            this.reason = reason;
        }
    }
}