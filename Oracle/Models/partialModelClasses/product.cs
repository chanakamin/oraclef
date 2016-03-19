using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    public partial class product
    {
        static private recipeEntities1 re;
        static product()
        {
            re = new recipeEntities1();
        }

        //=========== create new product from class Product from application classes
        public static product create(Product product)
        {
            using(var res = new recipeEntities1()){
                product p = new product();
                List<int> managers = res.users.Where(u => u.user_or_manager == true)
                .Select(u => u.id).ToList();
              p.name = product.name;
              p.description = product.description;
              p.user_id = product.userId;
              p.approved = managers.Any(id => id == p.user_id);
              p.amount_weight_in_volume = product.weight_in_volume;
              p.nutritional_per = product.nutritional_per;
              p.unit_amount = product.unit_amount;
              return p;
            }            
        }

        // This method set measurements of products, get 2 strings that represent measurements.
        // Those strings can be the alias of measurement, its id or null.
        // If they are null, default values are asigned.
        //public product setMeasurements(string aliasVolume, string aliasWeight)
        //{
        //    int weight, volume;
        //    if (!string.IsNullOrEmpty(aliasVolume) && !string.IsNullOrEmpty(aliasWeight))
        //    {
        //        if (int.TryParse(aliasVolume, out volume) && int.TryParse(aliasWeight, out weight))
        //        {
        //            this.measurements_id_volume = volume;
        //            this.measurements_id_weight = weight;
        //        }
        //        else
        //        {
        //            this.measurements_id_volume = re.measurements
        //                .FirstOrDefault(m => m.alias == aliasVolume).id;
        //            this.measurements_id_weight = re.measurements
        //                .FirstOrDefault(m => m.alias == aliasWeight).id;
        //        }
        //    }
        //    else
        //    {
        //        this.measurements_id_volume = 2;
        //        this.measurements_id_weight = 1;
        //    }
        //    return this;
        //}

        // function for serialize
        public product getSerialize()
        {
            var n = re.measure_type.Where(t => t.id == this.nutritional_per).First();
            return new product() { 
                id = this.id,
                name = this.name,
                description = this.description,
                unit_amount = this.unit_amount,
                amount_weight_in_volume = this.amount_weight_in_volume,
                measure_type = re.measure_type.Where(t=>t.id == this.nutritional_per).First().getSerialize(),
                user_id = this.user_id,
                approved = this.approved,
                products_in_nutritional_value = re.products_in_nutritional_value.Where(pr=>pr.product_id == this.id).ToList().Select(pr=>pr.getSerialize()).ToList()
            };
        }
       
    }
}