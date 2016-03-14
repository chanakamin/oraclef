using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    public partial class measure_type
    {
        public measure_type getSerialize()
        {
            return new measure_type()
            {
                id = this.id,
                measure_type1 = this.measure_type1
            };
        }
    }
}