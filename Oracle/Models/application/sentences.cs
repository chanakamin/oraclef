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
        public static string duplicateVote { get; set; }
        public static string existUser { get; set; }
        public static string notExistUser { get; set; }
        public static string emailExist { get; set; }

        static sentences()
        {
            notAllowedData = "You aren't allowed to get that data";
            notAllowedPage = "You are";
            duplicateVote = "You already choose this recipe";
            existUser = "This user already exist";
            notExistUser = "This User doesn't exists";
            emailExist = "This email address already exists";
        }
    }
}