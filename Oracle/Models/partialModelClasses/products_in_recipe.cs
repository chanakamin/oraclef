using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    public partial class products_in_recipe
    {
        public products_in_recipe getSerialize() {
            return new products_in_recipe() { 
                amount =this.amount,
                id = this.id,
                recipe_id = this.recipe_id,
                measurements_id = this.measurements_id,
                product_id = this.product_id
            };
        }
    }
}