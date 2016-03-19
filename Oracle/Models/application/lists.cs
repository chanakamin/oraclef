using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Providers.Entities;
using System.Runtime.Serialization.Json;
using Newtonsoft.Json;

namespace Oracle.Models
{   public class productreturn
        {
            public product product { get; set; }
            public List<nutritional_value_details> nutritional { get; set; }
        }
    public static class lists
    {
        
        public static List<productreturn> products(object user) 
        {
            using (recipeEntities1 recipes = new recipeEntities1())
            {
                int id;
                bool isManager = false;
                if (user is user)
                {
                    id = (user as user).id;
                    isManager = (user as user).user_or_manager;
                }
                else
                    id = 0;
                List<nutritional_value_details> nutritionalDetails = recipes.nutritional_value_details.ToList();
                List<product> products = recipes.products.Where(p => isManager || p.approved == true || p.user_id == id).ToList();
                products = products.Select(p => p.getSerialize()).ToList();
                var prod = products.Select(p => new productreturn(){ product = p, nutritional = nutritionalDetails.Where(nv => nv.product_id == p.id).ToList() }).ToList();
                return prod;
            }           
        }

        public static List<recipe> recipes(object user)
        {
            using (recipeEntities1 recipes = new recipeEntities1())
            {
                int id;
                bool isManager = false;
                if (user is user)
                {
                    id = (user as user).id;
                    isManager = (user as user).user_or_manager;
                }
                else
                    id = 0;
                List<recipe> recipe = recipes.recipes.Where(r => isManager || r.approved == true || r.user_id == id).ToList();
                recipe = recipe.Select(r => r.getSerialize()).ToList();

                return recipe;
            }
        }

        public static object details(object user) {
            using (recipeEntities1 recipes = new recipeEntities1())
            {
                var nvv = recipes.nutritional_value.Where(nv => nv.mustable).ToList();
                var ans = new
                    {
                        measureTypes = recipes.measure_type.ToList().Select(t => t.getSerialize()).ToList(),
                        measurements = recipes.measurement_with_type.ToList(),
                        nutritionalValues = nvv.Select(nv => nv.getSerialize()).ToList(),
                        user = user
                    };
                return ans;
                //return JsonConvert.SerializeObject(ans);                
            }  
        }


    }
}