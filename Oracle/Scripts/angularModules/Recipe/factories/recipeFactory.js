/// <reference path="../../../plugin/own.js" />
(function () {
    /* Fuctory to save all functions of recipe */
    angular.module('factoryModule').factory('RecipesFactory', function ($http, $location, resourcesFactory, DetailsFactory, ProductsFactory, userFactory, convertFactory) {
        var current = 0;
        var recipes = [],
            categories = [];
        // inner functions in factory
        //function to create new recipe
        function Recipe(name ,description,  preparation, portions, instructions, tips, category) {
            this.name = name;
            this.description = description;
            this.user_id = userFactory.getUser().id;
            this.preparation = preparation;
            this.category1 = category;
            this.time = time;
            this.tips = tips;
        }
        Recipe.prototype.getNutritional = function (nutrition) {
            return Recipe.prototype.getNutritionals.call(this)[nutrition];
        };
         Recipe.prototype.getNutritionals = function () {
             var nutritionals = convertFactory.calcNutrition(this.products, ProductsFactory);
            return nutritionals;
        };
        Recipe.prototype.hasProduct = function (id) {
            return this.products.some(function (p) {
                return p.product_id == id;
            });
        };

        // function to orginized list of recipes, get list from ajax request
        var orginizedList = function (recipesList, add) {
            if(!add)
                recipes = [];
            recipes = recipesList;
        };

        // this function return list of recipes, orginized by their category.
        var orginizedListByCategories = function (list, sign) {
            var res = [];
            categories.forEach(function (c) {
                res[c.id] = { name: c.name, category: c, list: [] };
            });
            list.forEach(function (l) {
                res[l.category].list.push(l);
            });
            if (sign !== 1)
                res = res.filter(function (f) {
                    return typeof f !== 'undefined';
                });
            return res;
        }

        // This function get products from db, using ajax call
        var initRecipesFromDb = function () {
            resourcesFactory.initResource('getRecipes','recipes')
                    .success(function (data) {
                        console.log('in init recipes');
                        console.log(data);
                        orginizedList(data);
                    })
                    .error(function (e) {
                        console.log('init recipes failed. ' + e);
                    });
        };
        // function to add recipe to db
        function addRecipeToDb(recipe) {
            var config = {
                recipe: recipe,
                equipments: recipe.equipments,
                products_in_recipe: recipe.products_in_recipe
            };
            recipe.equipments = recipe.products_in_recipe = null;
            resourcesFactory.addResource('addRecipe', config)
                .then(function (data) {
                    var r = data.data.recipe;
                    recipe.id = r.id;
                    recipes.push(r);
                    $location.path('/recipe/' + r.id);
                });
        }

        // Function for use with the factory
        return {
            // function to initialize list of recipes
            initRecipes: function (init) {
                if (init)
                    initRecipesFromDb();
                else
                {
                    var r = resourcesFactory.getResource('recipes');
                    categories = resourcesFactory.getResource('categories');
                    orginizedList(r);
                }
            },
            // function to get list of recipes
            getRecipes: function () {
                if (recipes.length === 0) {
                    this.initRecipes();
                }                    
                return recipes;
            },
            getCategories: function() {
                return categories;
            },
            // function to get recipe upon id
            getRecipe: function (id) {
                var r = recipes.filter(function (r) {
                    return r.id === id;
                });
                if (r.length == 0)
                    r = recipes[0];
                else
                    r = r[0];
                return r;
            },
            // get list of liked recipes
            getLiked: function () {
                return recipes.filter(function (r) {
                    return userFactory.isLike(r.id);
                });
            },
            getCategory: function (id){
                return categories.filter(function (c) { return c.id == id })[0];
            },
            // function to create recipe, and add it to list
            createRecipe: function (name ,description,  preparation, portions, instructions, tips, category, photo) {
                var r = new Recipe(name, description, preparation, portions, instructions, tips, category, photo);
            },
            addRecipe: function (recipe) {
                var userId = userFactory.getUser().id;
                if (userId > 0) {
                    recipe.user_id = userId;
                    addRecipeToDb(recipe);
                }
            },
            setCurrent: function (cur) {
                current = cur;
            },
            getCurrentRecipe: function () {
                var l = $location.path().split('/');
                l = l.pop();
                if (!isNaN(parseInt(l)))
                    current = parseInt(l);
                if (current == 0)
                    current = recipes[0].id;
                return this.getRecipe(current);
            },
            // set product & measurement for any product in recipe
            setObjects: function (r) {
                angular.forEach(r.products, function (val) {
                    val.product = ProductsFactory.getProduct(val.product_id);
                    val.measurement = DetailsFactory.getMeasurement(val.measurements_id);
                })
            },
            notApproved: function() {
                return recipes.filter(function (r) {
                    return !r.approved;
                });
            },
            update: function (recipe) {
                return resourcesFactory.updateResource('recipe', { r: recipe })
                 .then(function (data) {
                     re = recipes.filter(function (r) {
                         return r.id == data.id;
                     })[0];
                     re = recipe;
                     $location.path('/recipe/' + re.id);
                     return re;
                 });
            },
            approve: function (id, ap) {
                var th = this;
                var method = 'delete', url = 'Data/recipe'
                if (ap) {
                    method = 'put';
                    url = 'Data/approver';
                }
                return resourcesFactory.action({
                    method: method,
                    url: url,
                    data: { id: id }
                }).then(function (data) {
                    if (!ap)
                        recipes.filter(function (r) {
                            return r.id == id;
                        })[0] = null;
                    else
                        recipes.filter(function (r) {
                            return r.id == id;
                        })[0].approved = true;
                    return true;//th.notApproved();
                });
            },
            // function to get specific nutritional data on recipe.
            recipeNutritional: function (recId, nutrition) {
                var r = recipes.filter(function (r) { return r.id == recId })[0];
                return Recipe.prototype.getNutritional.call(r,nutrition);
            },
            recipeNutritionals: function (recId) {
                var r = recipes.filter(function (r) { return r.id == recId })[0];
                return Recipe.prototype.getNutritionals.call(r);
            },
            recipeNutritionalsPerService: function (recId) {
                var nut = [];
                var r = recipes.filter(function (r) { return r.id == recId })[0];
                nut = Recipe.prototype.getNutritionals.call(r);
                return nut.map(function (n) { });
            },
            // this functin returns array of recipes their calories between values support, from list suppplied
            recipesBetweenCalories: function (recipesList, minCalories, maxCalories) {
                var res = [], amount = 0;
                angular.forEach(recipesList, function (rec) {
                    amount = Recipe.prototype.getNutritional.call(rec,"Energy").value;
                    if (amount >= minCalories && amount <= maxCalories)
                        res.push(rec);
                });
                return res;
            },
            // this function get recipe and product and return boolean value if this recipe has this product.
            recipeHasProduct: function (recipe, productId) {
                return Recipe.Call('hasProduct', recipe, [productId]);
            },
            recipeHasProducts: function (recipe, products) {
                var count = 0,id;
                products.forEach(function (p) {
                    if (angular.isObject(p))
                        id = p.id;
                    else
                        id = p;
                    if (Recipe.Call('hasProduct', recipe, [id]))
                        count++;
                });
                return count;
            },
            orginizedByCategories: function (l,remain) {
                if (typeof l === 'undefined') {
                    l = recipes.getCopy();
                }
                l = orginizedListByCategories(l,remain);
                return l;
            }
        };
    });
})();