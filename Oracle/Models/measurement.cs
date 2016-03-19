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
    
    public partial class measurement
    {
        public measurement()
        {
            this.measurements1 = new HashSet<measurement>();
            this.nutritional_value = new HashSet<nutritional_value>();
            this.products_in_recipe = new HashSet<products_in_recipe>();
        }
    
        public int id { get; set; }
        public string name { get; set; }
        public string alias { get; set; }
        public int measure_type_id { get; set; }
        public Nullable<int> measurement_id { get; set; }
        public Nullable<double> amount { get; set; }
    
        public virtual measure_type measure_type { get; set; }
        public virtual ICollection<measurement> measurements1 { get; set; }
        public virtual measurement measurement1 { get; set; }
        public virtual ICollection<nutritional_value> nutritional_value { get; set; }
        public virtual ICollection<products_in_recipe> products_in_recipe { get; set; }
    }
}
