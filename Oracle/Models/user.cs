//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Oracle.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class user
    {
        public user()
        {
            this.products = new HashSet<product>();
            this.recipe_for_user = new HashSet<recipe_for_user>();
        }
    
        public int id { get; set; }
        public string name { get; set; }
        public string password { get; set; }
        public string email { get; set; }
        public bool user_or_manager { get; set; }
    
        public virtual ICollection<product> products { get; set; }
        public virtual ICollection<recipe_for_user> recipe_for_user { get; set; }
    }
}
