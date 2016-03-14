(function () {
    /* Factory to save all function of product */
    function fact(resourcesFactory, DetailsFactory, userFactory, $rootScope, $location) {
        var products = [];
        // create new product object
        function Product(productName,description,weight_in_volume,measure){
            this.name = productName;
            this.description;
            this.weight_in_volume = weight_in_volume;
            this.nutritional_per = measure;
        }    
        Product.prototype.addProduct = function (nutritionals) {
            var config = {
                addProduct: this,
                nutritionals: nutritionals
            };
            resourcesFactory.addResource('addProduct', config)
                    .then(function (data) {
                        var p = angular.fromJson(data).data.p;
                        this.id = p.id;
                        products.push(product);
                        console.log("add product succeed");
                    });
        }

        Product.prototype.updateProduct = function () {
            var config = {
                product: this,
            };
            resourcesFactory.updateResource('product', config)
                .then(function (data) {
                    angular.forEach(data, function (val, key) {
                        this[val] = key;
                    });
                });
        }
        function orginizedProduct(p) {
            var pr = new Product();
            angular.forEach(p, function (val, key) {
                pr[key] = val;
            });
            return pr;
        }

        // orginized list of products from server call
        var orginizedList = function (product, add) {
            if (!add)
                products = [];
            var p, pr;
            angular.forEach(product, function (value) {
                p = value.product;
                pr = new Product();
                angular.forEach(p, function (val, key) {
                    if (val)
                        pr[key] = val;
                });
                pr.nutritionalValue = value.nutritional;
                products.push(pr);
            });
        }        

        //  add product to db
        var addProductToDb = function (product, nutritionals) {
            var config = {
                addProduct: product,
                nutritionals: nutritionals
            };
            resourcesFactory.addResource('addProduct', config)
                    .then(function (data) {
                        debugger;
                        var p = angular.fromJson(data).data.p;
                        product.id = p.id;
                        products.push(product);
                        console.log("add product succeed");
                    });
            //});
            //.error(function (e) {
            //    console.log("add product fail");
            //});
        };
        var initProductsFromDb = function () {
            resourcesFactory.initResource('getProduct', 'products')
                .success(function (data) {
                    console.log("in init from db");
                    console.log(data);
                    orginizedList(data);
                })
                 .error(function (er) {
                     console.log(er);
                 });
        }
        //Those functions for use
        return {
            // init list of products
            initProducts: function (init) {
                if (init)
                    initProductsFromDb();
                else {
                    var r = resourcesFactory.getResource("products");
                    orginizedList(r);
                }
            },            
            // get list of all products
            getProducts: function () {
                if (products.length === 0) {
                    this.initProducts();
                }
                return products;                    
            },
            getProduct: function (id) {
                var p = products.filter(function (p) {
                    return p.id === id;
                });
                if (p.length == 0)
                    p = products[0];
                else
                    p = p[0];
                return p;
            },
            getLength: function () {
                return products.length;
            },
            //add product to list
            createProduct: function (productName, description, amount, measure) {
                var product = new Product(productName,description,amount);
                products.push(product);
                addProductToDb(product);
                return product;
            },
            addProduct: function (product, nutritionalsValues) {
                var userId = userFactory.getUser().id;
                product = orginizedProduct(product);
                if (userId > 0) {                    
                    product.userId = userId;
                    product.addProduct(nutritionalsValues);
                   // addProductToDb(product, nutritionalsValues);
                }
            },
            update: function (product) {
                return resourcesFactory.updateResource('product', { p: product })
                .then(function (data) {
                    pr = products.filter(function (p) {
                        return p.id == data.id;
                    })[0];
                    pr = product;
                    //$location.path('/recipe/' + re.id);
                    return pr;
                });
            },
            notApproved: function () {
                return products.filter(function (p) {
                    return !p.approved;
                });
            },
            approve: function (id, ap) {
                var th = this;
                var method = 'delete', url = 'Data/product'
                if (ap) {
                    method = 'put';
                    url = 'Data/approvep';
                }
                return resourcesFactory.action({
                    method: method,
                    url: url,
                    data: {id: id}
                }).then(function (data) {
                    if (!ap)
                        products.filter(function (p) {
                            return p.id == id;
                        })[0] = null;
                    else
                        products.filter(function (p) {
                            return p.id == id;
                        })[0].approved = true;
                    return true;//th.notApproved();
                });
            },
            getCurrentProduct: function () {
                var l = $location.path().split('/');
                l = l.pop();
                if (!isNaN(parseInt(l)))
                    current = parseInt(l);
                if (current == 0)
                    current = recipes[0].id;
                return this.getProduct(current);
            },
            // set product & measurement for any product in recipe
            setObjects: function (r) {
                //angular.forEach(r.products, function (val) {
                //    val.product = ProductsFactory.getProduct(val.product_id);
                //    val.measurement = DetailsFactory.getMeasurement(val.measurements_id);
                //})
            },
        };
    
    };
    angular.module("factoryModule").factory("ProductsFactory", ['resourcesFactory', 'DetailsFactory','userFactory','$rootScope','$location',fact]); 
})();