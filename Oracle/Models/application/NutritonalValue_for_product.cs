using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Oracle.Models
{
    // helper class for nutritional value per products
    // represent the nutritional value name & amount  
    public class NutritonalValue_for_product
    {
       
        //=========  Properties
        //public string name { get; set; }
        public double amount { get; set; }
        public int idNutritional { get; set; }                

        private int productID;

        public int productId
        {
            get { return productID; }
            set { productID = value; }
        }
        
       
        //========= Constructors
          // private - can't make instance without name & id
        //private NutritonalValue_for_product(double amount)
        //{
        //    this.amount = amount;
        //}
        //public NutritonalValue_for_product(string name,double amount):this(amount)
        //{
        //    this.name = name;
        //}
        //public NutritonalValue_for_product(int idNutritional,double amount):this(amount)
        //{
        //    this.idNutritional = idNutritional;
        //}
        //public NutritonalValue_for_product(products_in_nutritional_value prod)
        //{
        //    this.amount = prod.amount_per_100;
        //    this.idNutritional = prod.nutritional_value_id;
        //    this.name = prod.nutritional_value.name;
        //}
      
        //======  Methods
        public products_in_nutritional_value getEntity()
        {
            return products_in_nutritional_value.create(this);
        }

        


    }
}