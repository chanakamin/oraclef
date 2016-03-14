using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    public partial class measurement
    {
        public measurement getSerialize()
        {
            return new measurement()
            {
                id = this.id,
                name = this.name,
                alias = this.alias,
                measure_type_id = this.measure_type_id,
                measurement_id = this.measurement_id,
                amount = this.amount
            };
        }
    }
}