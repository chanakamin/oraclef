using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Oracle.Controllers
{
    public class ManagerController : Controller
    {
        //
        // GET: /Manager/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Welcome()
        {
            return PartialView();
        }

        public ActionResult editProduct()
        {
            return PartialView();
        }

        public ActionResult editRecipe()
        {
            return PartialView();
        }

        public ActionResult edit(bool isrecipe)
        {
            if(isrecipe)
                return RedirectToAction("editRecipe");
            else
                return RedirectToAction("editProduct");
        }
        public ActionResult approved()
        {
            return PartialView();
        }

    }
}
