using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Oracle.Models;
using System.Data;
using System.Data.Entity.Validation;

namespace Oracle.Controllers
{
    public class DataController : Controller
    {
        private static recipeEntities recipes;
        static DataController ()
	    {
            recipes = new recipeEntities();
            //nutritional_value n = recipes.nutritional_value.Where(nt => nt.name == "sugar").First();
            //n.mustable = false;
            //recipes.SaveChanges();
	    }       
        //
        // GET: /Data/
        [HttpGet]
        public JsonResult getLists()
        {
            using (recipes = new recipeEntities())
            {
                var cat = recipes.categories.ToList().Select(c => c.getSerialize()).ToList();
                var pro = getProducts().Data;
                var det = getDetails().Data;
                var rec =  getRecipes().Data;
                var ans = new
                {
                    success = true,
                    categories = cat,
                    products = pro,
                    details = det,
                    recipes = rec
                };
                return Json(ans, JsonRequestBehavior.AllowGet);
            }
        }
        
        [HttpGet]
        public JsonResult getProducts(string where="")
        {
            using (recipes = new recipeEntities())
            {
                int id;
                bool isManager = false;
                if (Session["user"] is user)
                {
                    id = (Session["user"] as user).id;
                    isManager = (Session["user"] as user).user_or_manager;
                }
                else
                    id = 0;
                List<nutritional_value_details> nutritionalDetails = recipes.nutritional_value_details.ToList();
                List<product> products = recipes.products.Where(p => isManager || p.approved == true || p.user_id == id).ToList();
                products = products.Select(p => p.getSerialize()).ToList();
                var prod = products.Select(p => new { product = p, nutritional = nutritionalDetails.Where(nv => nv.product_id == p.id).ToList() }).ToList();
                return Json(prod, JsonRequestBehavior.AllowGet);
            }   
        }

        [HttpGet]
        public JsonResult getDetails()
        {
            using (recipes = new recipeEntities()) {
                var nvv = recipes.nutritional_value.Where(nv => nv.mustable).ToList();
                return Json(
                    new
                    {
                        measureTypes = recipes.measure_type.ToList().Select(t => t.getSerialize()).ToList(),
                        measurements = recipes.measurement_with_type.ToList(),
                        nutritionalValues = nvv.Select(nv => nv.getSerialize()).ToList(),
                        // recipes = recipes.recipes,
                        user = Session["user"]
                    },
                    JsonRequestBehavior.AllowGet
                    );
            }  
        }

        [HttpGet]
        public JsonResult users()
        {
            using (recipes = new recipeEntities())
            {
                user user = (Session["user"] as user);
                if (user != null && user.user_or_manager)
                    return Json(new { success = true, users = recipes.users.Select(u => u.getSerialize()).ToList() }, JsonRequestBehavior.AllowGet);
                return Json(new { success = false, reason = sentences.notAllowedData }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult getRecipes()
        {
            using (recipes = new recipeEntities())
            {
                int id;
                bool isManager = false;
                if (Session["user"] is user)
                {
                    id = (Session["user"] as user).id;
                    isManager = (Session["user"] as user).user_or_manager;
                }
                else
                    id = 0;
                List<recipe> recipe = recipes.recipes.Where(r => isManager || r.approved == true || r.user_id == id).ToList();
                recipe = recipe.Select(r => r.getSerialize()).ToList();

                return Json(recipe, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult favorite()
        {
            using (recipes = new recipeEntities())
            {
                List<int> recipesid = new List<int>();
                int id;
                if (Session["user"] is user)
                {
                    id = (Session["user"] as user).id;
                    recipesid = recipes.recipe_for_user.Where(ru => ru.user_id == id).ToList().Select(ru => ru.recipe_id).ToList();
                }
                else
                    id = 0;
                return Json(recipesid, JsonRequestBehavior.AllowGet);
            }
        }
        // post request - add to db
        [HttpPost]
        public JsonResult addProduct(Product addProduct, NutritonalValue_for_product[] nutritionals)
        {
            using (recipes = new recipeEntities())
            {
                try
                {
                    recipes.SaveChanges();
                }
                catch (DbEntityValidationException ex)
                {
                    catch_errors(ex);
                }
                product p = addProduct.getEntity();
                var pr = recipes.Entry(p);
                pr.State = EntityState.Added;
                List<products_in_nutritional_value> nutritionalsVal = nutritionals.Select(n => n.getEntity()).ToList();
                pr.Entity.products_in_nutritional_value = nutritionalsVal;
                try
                {
                    recipes.SaveChanges();
                }
                catch (DbEntityValidationException ex)
                {
                    catch_errors(ex);
                }
                return Json(new { success = true, p = p.getSerialize() });
            }

        }
        [HttpPost]
        public JsonResult addRecipe(recipe recipe,equipment_in_recipe[] equipments, products_in_recipe[] products_in_recipe)
        {
            using (recipes = new recipeEntities())
            {
                try
                {
                    recipes.SaveChanges();
                }
                catch (DbEntityValidationException ex)
                {
                    catch_errors(ex);
                    // Retrieve the error messages as a list of strings.
                }
                var r = recipes.Entry(recipe);
                r.State = EntityState.Added;
                r.Entity.equipment_in_recipe = equipments;
                r.Entity.isApproved();
                r.Entity.products_in_recipe = products_in_recipe;
                try
                {
                    recipes.SaveChanges();
                }
                catch (DbEntityValidationException ex)
                {
                    catch_errors(ex);
                    // Retrieve the error messages as a list of strings.
                }
                return Json(new { success = true, recipe = recipe.getSerialize() });
            }
        }

        [HttpPost]
        public JsonResult favorite(int recipe) 
        {
            using (recipeEntities re = new recipeEntities())
            {
                try
                {
                    int id = (Session["user"] as user).id;
                    if (id != null)
                    {
                        var ex = re.recipe_for_user.Where(r => r.user_id == id && r.recipe_id == recipe).FirstOrDefault();
                        if (ex == null)
                        {
                            var ru = new recipe_for_user() { recipe_id = recipe, user_id = id };
                            re.recipe_for_user.Add(ru);
                            re.SaveChanges();
                            return Json(new { id = ru.id, success = "success" });
                        }
                        return Json(new { id = ex.id, success = "false", reason = sentences.duplicateVote });
                    }
                }
                catch (Exception)
                {
                }
                return Json("fail");
            }
        }

        // update functions
        [HttpPut]
        public JsonResult product(product p)
        {
            using (recipes = new recipeEntities())
            {
                bool ans = false;
                if (ModelState.IsValid)
                {
                    //recipes.Entry(p).State = EntityState.Modified;
                    recipes.SaveChanges();
                    ans = true;
                }
                return Json(new { success = ans, product = p }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPut]
        public JsonResult recipe(recipe r)
        {
            using (recipes = new recipeEntities())
            {
                bool ans = false;
                if (ModelState.IsValid)
                {
                    var rec = recipes.Entry(r);
                    //rec.State = EntityState.Modified;
                    recipes.SaveChanges();
                    ans = true;
                }
                return Json(new { success = ans, recipe = r }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPut]
        public JsonResult approver(int id)
        {
            using (recipes = new recipeEntities())
            {
                var rec = recipes.recipes.FirstOrDefault(r => r.id == id);
                rec.approved = true;
                recipes.SaveChanges();
                return Json(new { success = "success", recipe = rec.getSerialize() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPut]
        public JsonResult approvep(int id)
        {
            using (recipes = new recipeEntities())
            {
                var pr = recipes.products.FirstOrDefault(p => p.id == id);
                pr.approved = true;
                recipes.SaveChanges();
                return Json(new { success = "success", product = pr.getSerialize() }, JsonRequestBehavior.AllowGet);
            }
        }

        // function to delete
        [HttpDelete]
        public JsonResult recipe(int id)
        {
            using (recipes = new recipeEntities())
            {
                bool ans = false;
                recipe recipe = recipes.recipes.FirstOrDefault(r => r.id == id);
                recipes.recipes.Remove(recipe);
                recipes.SaveChanges();
                return Json(new { success = ans }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpDelete]
        public JsonResult product(int id)
        {
            using (recipes = new recipeEntities())
            {
                bool ans = false;
                product product = recipes.products.FirstOrDefault(p => p.id == id);
                recipes.products.Remove(product);
                recipes.SaveChanges();
                return Json(new { success = ans }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpDelete]
        public JsonResult favorite(int recipe, bool allow = false)
        {
            using (recipes = new recipeEntities()) {
                recipe_for_user ur = recipes.recipe_for_user.FirstOrDefault(u => u.id == recipe);
                recipes.recipe_for_user.Remove(ur);
                recipes.SaveChanges();
                return Json("success", JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult user(int id)
        {
            using (recipes = new recipeEntities())
            {
                bool ans = false;
                user user = recipes.users.FirstOrDefault(p => p.id == id);
                recipes.users.Remove(user);
                recipes.SaveChanges();
                return Json(new { success = ans }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Index()
        {
            return View();
        }

        private void catch_errors(DbEntityValidationException ex){
            var errorMessages = ex.EntityValidationErrors
                        .SelectMany(x => x.ValidationErrors)
                        .Select(x => x.ErrorMessage);
                // Join the list to a single string.
                var fullErrorMessage = string.Join("; ", errorMessages);
                // Combine the original exception message with the new one.
                var exceptionMessage = string.Concat(ex.Message, " The validation errors are: ", fullErrorMessage);
                // Throw a new DbEntityValidationException with the improved exception message.
                throw new DbEntityValidationException(exceptionMessage, ex.EntityValidationErrors);
        }


        public object recipesid { get; set; }
    }
}
