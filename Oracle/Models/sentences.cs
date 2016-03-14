using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    static public class sentences
    {
        public static string notAllowedData { get; set; }
        public static string notAllowedPage { get; set; }

        static sentences()
        {
            notAllowedData = "You aren't allowed to get that data";
            notAllowedPage = "You are";
        }
    }
}