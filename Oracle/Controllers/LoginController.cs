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
        static recipeEntities re;
        static LoginController() {
            re = new recipeEntities();
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
        public JsonResult user()
        {
            int status = 0;//, id = -1;
            user u = Session["user"] as user;
            if (u != null)
            {
                status++;
               // id = u.id;
            }
            return Json(new { status = status, user = u }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult existUser(string name, string password,string email) {
            using (recipeEntities re = new recipeEntities())
            {
                bool can = true;
                user user = null;
                string reason = "This User doen't exists";
                var c = re.users.Where(u => u.name == name && u.password == password).Count();
                if (c != 0)
                {
                    can = false;
                    reason = "This user already exist";
                    user = re.users.Where(u => u.name == name && u.password == password).First();
                    Session["user"] = user;
                }
                else if (email != null)
                {
                    c = re.users.Where(u => u.email == email).Count();
                    if (c != 0)
                    {
                        can = false;
                        reason = "This email address already exists";
                    }
                }
                if (user != null)
                    user = user.getSerialize();
                var ob = new { can = can, reason = reason, exist = !can, user = user };
                return Json(ob, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult addUser(user user)
        {
            var success = true;
            if (TryUpdateModel(user))
            {
                re.users.Add(user);
                //Membership.CreateUser(user.name, user.password);
                try
                {
                    //Membership.CreateUser(user.name, user.password, user.email);
                    re.SaveChanges();
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
                success = false;
            }
            return Json(new { success = success,id = user.id, user = user.getSerialize() },JsonRequestBehavior.AllowGet);
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
            if (TryUpdateModel(user))
            {
               // Membership.ValidateUser(user.name, user.password);
                Session["user"] = user;
            }
            else
                Session["user"] = null;
            return Json("success", JsonRequestBehavior.AllowGet);
        }
        public JsonResult guest() {
            Session["user"] = "guest";
            return Json("success", JsonRequestBehavior.AllowGet);
        }
        public JsonResult unregister(int id)
        {
            string res = "success";
            object obj = Session["user"];
            user u;
            if (obj is user && (u = (user)obj).id == id)
            {                
                Session["user"] = null;
            }
            else
                res = "fail";
            return Json(res, JsonRequestBehavior.AllowGet);
        }
    }
}
