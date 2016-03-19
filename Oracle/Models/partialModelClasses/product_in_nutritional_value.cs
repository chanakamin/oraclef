using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    public partial class products_in_nutritional_value
    {
        static recipeEntities1 re;
        static products_in_nutritional_value()
        {
            re = new recipeEntities1();
        }        
       
        //========= Constructors
       
        public static products_in_nutritional_value create(NutritonalValue_for_product nutritional_for_product)
        {
            var pn = new products_in_nutritional_value();
            pn.amount_per_100 = nutritional_for_product.amount;
            pn.nutritional_value_id = nutritional_for_product.idNutritional;
            pn.product_id = nutritional_for_product.productId;
            return pn;
        }

        public products_in_nutritional_value getSerialize()
        {
            return new products_in_nutritional_value() {
                amount_per_100 = this.amount_per_100,
                id = this.id,
                nutritional_value_id = this.nutritional_value_id,
                product_id = this.product_id
            };
        }
    }

}