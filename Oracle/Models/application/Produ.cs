using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    public class prod
    {

       // public List<products_in_nutritional_value> nutritionalsValues { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public double weight_in_volume { get; set; }
        public int userId { get; set; }

        public prod(List<NutritonalValue_for_product> nutritionalValues, string description, double weight_in_volume, int user_id, string name = "")
        {
            //this.nutritionalsValues = nutritionalValues.Select(n=>n.getEntity()).ToList();
            this.name = name;
            this.description = description;
            this.weight_in_volume = weight_in_volume;
            this.userId = user_id;
            
        }

        // methods
        //public product getEntity()
        //{
        //    return new product(this);
        //}

    }
}