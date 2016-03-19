using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Oracle.Models;
using System.Web.Security;
using System.Data.Entity.Validation;

namespace Oracle.Controllers
{
    public class LoginController : Controller
    {
        //
        // GET: /Login/
        static recipeEntities1 re;
        static LoginController() {
            re = new recipeEntities1();
        }
        public ActionResult Index()
        {
            return View();
        }
        // Functions return partial views - for routing
        public ActionResult Welcome()
        {
            return PartialView();
        }
        public ActionResult Signup()
        {
            return PartialView();
        }
        public ActionResult SignIn()
        {
            return PartialView();
        }
        public ActionResult Logout(bool view = false)
        {
            Session["user"] = null;
            if (!view)
            {               
                return RedirectToAction("Welcome");
            }
            return RedirectToAction("Index");

        }
        
        public ActionResult Login()
        {
            return PartialView();
        }


        // Functions return/ does operations upon ajax call
        [HttpGet]
        public JsonResult user()
        {
            returnType ans = new returnType();
            user u = Session["user"] as user;
            if (u == null)
            {
                ans.status = 300;
            }
            else
            {
                ans.data = new { user = u };
            }
            return Json(ans, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult existUser(string name, string password,string email) {
            using (recipeEntities1 re = new recipeEntities1())
            {
                returnType ans = new returnType();
                bool can = true;
                user user = null;
                ans.reason = sentences.notExistUser; ;
                var c = re.users.Where(u => u.name == name && u.password == password).Count();
                if (c != 0)
                {
                    can = false;
                    user = re.users.Where(u => u.name == name && u.password == password).First();
                    Session["user"] = user;
                    ans.reason = sentences.existUser;
                }
                else if (email != null)
                {
                    c = re.users.Where(u => u.email == email).Count();
                    if (c != 0)
                    {
                        can = false;
                        ans.reason = sentences.emailExist;
                    }
                }
                if (user != null)
                    user = user.getSerialize();
                ans.data = new { can = can, exist = !can, user = user };
                return Json(ans, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult addUser(user user)
        {
            returnType ans = new returnType();
            if (TryUpdateModel(user))
            {
                re.users.Add(user);
                //Membership.CreateUser(user.name, user.password);
                try
                {
                    //Membership.CreateUser(user.name, user.password, user.email);
                    re.SaveChanges();
                    ans.data = new { id = user.id, user = user.getSerialize() };
                }
                catch (DbEntityValidationException ex)
                {
                    // Retrieve the error messages as a list of strings.
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
                               
            }
            else
            {
                ans.status = 350;
            }
            return Json(ans, JsonRequestBehavior.AllowGet);
        }
        public ActionResult allRecipes() {
            return View();
        }

        public ActionResult changePart(string part) 
        {  RedirectToRoute(part,new {partial = true});
            return RedirectToAction("Index", part,new System.Web.Routing.RouteValueDictionary(new {partial = true}));    
        }

        public ActionResult register(user user)
        {
            returnType ans = new returnType();
            if (TryUpdateModel(user))
            {
                // Membership.ValidateUser(user.name, user.password);
                Session["user"] = user;
            }
            else
            {
                Session["user"] = null;
                ans.status = 500;
            }
            return Json(ans, JsonRequestBehavior.AllowGet);
        }
        public JsonResult guest() {
            Session["user"] = "guest";
            return Json(new returnType(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult unregister(int id)
        {
            returnType ans = new returnType();
            object obj = Session["user"];
            user u;
            if (obj is user && (u = (user)obj).id == id)
            {
                Session["user"] = null;
            }
            else
                ans.status = 500;
            return Json(ans, JsonRequestBehavior.AllowGet);
        }
    }
}
