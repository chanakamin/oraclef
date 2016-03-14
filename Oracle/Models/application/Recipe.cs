using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    public class Recipe
    {
        public string name { get; set; }
        public int user_id { get; set; }
        public Nullable<int> MyProperty { get; set; }
    }
}