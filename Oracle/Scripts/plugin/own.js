Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
}

Array.method('getCopy',function () {
    var arr = [];
    this.forEach(function (o) {
        arr.push(o);
    });
    return arr;
});

Array.method('getCopyElements', function () {
    var arr = this.getCopy();
    for (var i = 0; i < arr.length; i++) {
        arr[i] = create(arr[i]);
    }
    return arr;
});

Function.method('Call', function (method,obj,values) {
    return this.prototype[method].apply(obj, values);
});

function create(obj) {
    var a = {};
    if (typeof obj === 'object') {
        for (var k in obj) {
            if (typeof obj[k] === 'object')
                a[k] = create(obj[k]);
            else
                a[k] = obj[k]
        }
    }
    return a;
}

function round(num, p) {
    var m = Math.pow(10, p);
    num *= m;
    num = Math.round(num);
    return num / m;
}

var sentences = {
    required: 'This field is required',
    emailstyle: 'Enter a valid email address',
    userExists: 'This user already exists',
    confirm: 'Password does not match',
    passwordL: 'Password too long',
    select: 'An option must be selected',
    product_recipe: 'A recipe must contain products',
}
//Object.method('getCopy', function () {
//    var a = {};
//    if (typeof this === 'object') {
//        for (var k in this) {
//            if (typeof this[k] === 'object')
//                a[k] = this[k].getCopy();
//            else if(typeof a[k] !== 'function')
//                a[k] = this[k];
//        }
//    }
//    a.constructor(this);
//    return a;
//});

