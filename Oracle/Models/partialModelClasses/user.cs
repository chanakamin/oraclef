using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    public partial class user
    {
        public user getSerialize()
        {
            return new user() { 
                id = this.id,
                name=this.name,
                password = this.password,
                email = this.email,
                user_or_manager = this.user_or_manager
            };
        }
    }
}