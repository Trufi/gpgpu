console.log('0 - 0, 1 - 1, 2 - 1, 3- 2, 4- 3, 5 - 5, 6 - 8, 7 - 13, 8 - 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765');

var f = (1 + Math.sqrt(5)) / 2;

var f1 = n => (Math.pow(f, n) - (-Math.pow(-f, -n))) / (2 * f - 1);

var f2 = n => {
    var a = 0;
    var b = 1;
    var c = 0;

    for (var i = 0; i < n - 1; i++) {
        c = a + b;
        a = b;
        b = c;
    }

    return c;
};

var piel = k => Math.pow(16, -k) * (4 / (8 * k + 1) - 2 / (8 * k + 4) - 1 / (8 * k + 5) - 1 / (8 * k + 6));

var pi = n => {
    var sum = 0;

    for (var i = 0; i < n; i++) {
        sum += piel(i);
    }

    return sum;
};
