using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    public class Product
    {
        public string name { get; set; }
        public string description { get; set; }
        public double weight_in_volume { get; set; }
        public int userId { get; set; }
        public int nutritional_per { get; set; }
        public double unit_amount { get; set; }

        // methods
        public product getEntity()
        {
            return product.create(this);
        }
    }
}