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
        private static recipeEntities1 recipes;
        static DataController ()
	    {
            recipes = new recipeEntities1();
            //nutritional_value n = recipes.nutritional_value.Where(nt => nt.name == "sugar").First();
            //n.mustable = false;
            //recipes.SaveChanges();
	    }       
        //
        // GET: /Data/
        [HttpGet]
        public JsonResult getLists()
        {
            using (recipes = new recipeEntities1())
            {
                object user = Session["user"];
                var cat = recipes.categories.ToList().Select(c => c.getSerialize()).ToList();
                var pro = lists.products(user);
                var det = lists.details(user);
                var rec =  lists.recipes(user);
                var ans = new returnType(new
                {
                    categories = cat,
                    products = pro,
                    details = det,
                    recipes = rec
                });
                return Json(ans, JsonRequestBehavior.AllowGet);
            }
        }
        
        [HttpGet]
        public JsonResult getProducts(string where="")
        {
            return Json(new returnType(new { products = lists.products(Session["user"]) }), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getDetails()
        {
            using (recipes = new recipeEntities1()) {
                var nvv = recipes.nutritional_value.Where(nv => nv.mustable).ToList();
                return Json(new returnType(new { details = lists.details(Session["user"]) }),
                    JsonRequestBehavior.AllowGet
                    );
            }  
        }

        [HttpGet]
        public JsonResult users()
        {
            using (recipes = new recipeEntities1())
            {
                var ans = new returnType();
                user user = (Session["user"] as user);
                if (user != null && user.user_or_manager)
                    ans.data = new { users = recipes.users.Select(u => u.getSerialize()).ToList() };
                else {
                    ans.reason = sentences.notAllowedData;
                    ans.status = 500;
                }
                return Json(ans, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult getRecipes()
        {
            return Json(new returnType(new { recipes = lists.recipes(Session["user"]) }), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult favorite()
        {
            using (recipes = new recipeEntities1())
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
                return Json(new returnType(new { id = recipesid }), JsonRequestBehavior.AllowGet);
            }
        }
        // post request - add to db
        [HttpPost]
        public JsonResult addProduct(Product addProduct, NutritonalValue_for_product[] nutritionals)
        {
            using (recipes = new recipeEntities1())
            {
                var ans = new returnType();
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
                    ans.data = new { product = p.getSerialize() };
                }
                catch (DbEntityValidationException ex)
                {
                    ans.status = 500;
                    ans.reason = ex.Message;
                    catch_errors(ex);
                }
                return Json(ans);
            }

        }
        [HttpPost]
        public JsonResult addRecipe(recipe recipe,equipment_in_recipe[] equipments, products_in_recipe[] products_in_recipe)
        {
            using (recipes = new recipeEntities1())
            {
                var ans = new returnType();
                var r = recipes.Entry(recipe);
                r.State = EntityState.Added;
                r.Entity.equipment_in_recipe = equipments;
                r.Entity.isApproved();
                r.Entity.products_in_recipe = products_in_recipe;
                try
                {
                    recipes.SaveChanges();
                    ans.data = new { recipe = recipe.getSerialize() };
                }
                catch (DbEntityValidationException ex)
                {
                    catch_errors(ex);
                    ans.status = 500;
                    ans.reason = ex.Message;
                    // Retrieve the error messages as a list of strings.
                }
                return Json(ans);
            }
        }

        [HttpPost]
        public JsonResult favorite(int recipe) 
        {
            using (recipeEntities1 re = new recipeEntities1())
            {
                returnType ans = new returnType();
                try
                {
                    int id;
                    user u = (Session["user"] as user);
                    if (u != null)
                    {
                        id = u.id;
                        var ex = re.recipe_for_user.Where(r => r.user_id == id && r.recipe_id == recipe).FirstOrDefault();
                        if (ex == null)
                        {
                            var ru = new recipe_for_user() { recipe_id = recipe, user_id = id, date = DateTime.Now };
                            re.recipe_for_user.Add(ru);
                            re.SaveChanges();
                            ans.data = new { id = ru.id };
                        }
                        else
                        {
                            ans.status = 300;
                            ans.reason = sentences.duplicateVote;
                            ans.data = new { id = ex.id };
                        }
                    }
                }
                catch (Exception e)
                {
                    ans.status = 500;
                    ans.reason = e.Message;
                }
                return Json(ans);
            }
        }

        // update functions
        [HttpPut]
        public JsonResult product(product p)
        {
            using (recipes = new recipeEntities1())
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
            using (recipes = new recipeEntities1())
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
            using (recipes = new recipeEntities1())
            {
                returnType ans = new returnType();
                var rec = recipes.recipes.FirstOrDefault(r => r.id == id);
                rec.approved = true;
                recipes.SaveChanges();
                ans.data = new { recipe = rec.getSerialize()};
                return Json(ans, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPut]
        public JsonResult approvep(int id)
        {
            using (recipes = new recipeEntities1())
            {
                returnType ans = new returnType();
                var pr = recipes.products.FirstOrDefault(p => p.id == id);
                pr.approved = true;
                recipes.SaveChanges();
                ans.data = new {product = pr.getSerialize()};
                return Json(ans, JsonRequestBehavior.AllowGet);
            }
        }

        // function to delete
        [HttpDelete]
        public JsonResult recipe(int id)
        {
            using (recipes = new recipeEntities1())
            {
                var ans = new returnType();
                recipe recipe = recipes.recipes.FirstOrDefault(r => r.id == id);
                recipes.recipes.Remove(recipe);
                try
                {
                    recipes.SaveChanges();
                }
                catch (Exception e) {
                    ans.status = 500;
                    ans.reason = e.Message;
                }
                return Json(ans, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpDelete]
        public JsonResult product(int id)
        {
            using (recipes = new recipeEntities1())
            {
                var ans = new returnType(); ;
                product product = recipes.products.FirstOrDefault(p => p.id == id);
                recipes.products.Remove(product);
                try
                {
                    recipes.SaveChanges();
                }
                catch (Exception e)
                {
                    ans.reason = e.Message;
                    ans.status = 500;
                }
                return Json(ans, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpDelete]
        public JsonResult favorite(int recipe, bool allow = false)
        {
            using (recipes = new recipeEntities1()) {
                recipe_for_user ur = recipes.recipe_for_user.FirstOrDefault(u => u.id == recipe);
                recipes.recipe_for_user.Remove(ur);
                recipes.SaveChanges();
                return Json("success", JsonRequestBehavior.AllowGet);
            }
        }

        [HttpDelete]
        public JsonResult user(int id)
        {
            using (recipes = new recipeEntities1())
            {
                returnType ans = new returnType();
                user user = recipes.users.FirstOrDefault(p => p.id == id);
                recipes.users.Remove(user);
                try
                {
                    recipes.SaveChanges();
                }
                catch (Exception e)
                {
                    ans.status = 500;
                    ans.reason = e.Message;
                }
                return Json(ans, JsonRequestBehavior.AllowGet);
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


        //public object recipesid { get; set; }
    }
}
