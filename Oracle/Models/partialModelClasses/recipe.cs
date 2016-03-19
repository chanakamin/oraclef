using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    public partial class recipe
    {
        static private recipeEntities1 re;
        static recipe() 
        {
            re = new recipeEntities1();
        }
        // list of special equipment
        public List<string> equipments
        {
            get
            {
                using (recipeEntities1 re = new recipeEntities1())
                {
                    return re.equipment_in_recipe.Where(eq => eq.recipe_id == this.id).Select(eq => eq.special_equipment).ToList();
                }
            }
        }
        // list of products
        public List<products_in_recipe> products
        {
            get
            {
                using (recipeEntities1 re = new recipeEntities1())
                {
                    return re.products_in_recipe.Where(pr => pr.recipe_id == this.id).ToList().Select(pr => pr.getSerialize()).ToList();
                }
            }
        }

        public int favorites { get {
            using (re = new recipeEntities1())
            {
                return re.recipe_for_user.Where(ru => ru.recipe_id == this.id).ToList().Count();
            }
        } }
        // set if recipe approved
        public bool isApproved() 
        {
            using (re = new recipeEntities1())
            {
                List<int> managers = re.users.Where(u => u.user_or_manager == true)
                    .Select(u => u.id).ToList();
                this.approved = managers.Any(id => id == this.user_id);
                return this.approved;
            }
        }
        // return recipe for serialize
        public recipe getSerialize()
        {
            using (recipeEntities1 re = new recipeEntities1())
            {
                recipe r = new recipe()
                {
                    id = this.id,
                    name = this.name,
                    portions = this.portions,
                    tips = this.tips,
                    approved = this.approved,
                    instructions = this.instructions,
                    preparation = this.preparation,
                    description = this.description,
                    category1 = re.categories.FirstOrDefault(c => c.id == this.category).getSerialize(),
                    category = this.category
                };
                return r;
            }
        }
       
    }
}