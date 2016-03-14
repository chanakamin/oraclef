using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    // partial class to help serialize
    public partial class nutritional_value
    {
        public nutritional_value getSerialize() 
        {
            nutritional_value nv = new nutritional_value() {
                 id = this.id,
                 measurements_id = this.measurements_id,
                 name = this.name,
                 mustable = this.mustable
            };
            return nv;
        }

    }
}