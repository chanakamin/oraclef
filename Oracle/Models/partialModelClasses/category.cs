using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    public partial class category
    {
        public category getSerialize()
        {
            return new category()
            {
                id = this.id,
                name = this.name
            };
        }
    }
}