// alert("Here we are!");
/**
 * 
 * @param {Number} numb 
 * @param {Number} pow 
 * @param {Number} mod 
 */
function Power(numb, pow, mod = Number.POSITIVE_INFINITY) {
    var ret = 1;
    if (pow > mod)
        pow = pow % GenericEuler(mod);
    for (var i = 0; i < pow; i++) {
        ret = (ret * numb) % mod;
    }
    while (ret < 0)
        ret += mod;
    return ret;
}
/**
 * 
 * @param {Number} numb 
 * @param {Number} mod 
 */
function Order(numb, mod) {
    var i = numb;
    var ret = 1;
    while (i !== 1) {
        ret++;
        i = (i * numb) % mod;
    }
    return ret;
}

/**
 * 
 * @param {Number} numb
 * @returns {Array<Number>}
 */
function PrimeFactors(numb) {
    var ret = [];
    if (PrimeFactors.primes == undefined)
        PrimeFactors.primes = [];
    var primes = PrimeFactors.primes;
    var n = numb;

    if (numb == 1) {
        ret.push(1);
        return ret;
    }

    if (PrimeFactors.primes.length == 0 || PrimeFactors.primes[PrimeFactors.primes.length - 1] < numb) {
        PrimeFactors.primes = [];
        for (var i = 2; i <= 2 * numb; i++) {
            PrimeFactors.primes.push(i);
        }
        for (var i = 0; i < PrimeFactors.primes.length; i++) {
            PrimeFactors.primes = PrimeFactors.primes.filter(function (v, inx) { return inx <= i || v % PrimeFactors.primes[i] != 0; });
        }
    }
    while (n > 1) {
        for (var i = 0; i < PrimeFactors.primes.length; i++) {
            if (n % PrimeFactors.primes[i] == 0) {
                n = n / PrimeFactors.primes[i];
                ret.push(PrimeFactors.primes[i]);
                break;
            }
        }
    }
    var p = 1;
    ret.forEach((v) => { p *= v; });
    console.assert(p == numb, "Prime factors product equals given number");
    return ret;
}

/**
 * 
 * @param {Number} numb 
 * @param {Array<number>} primes
 */
function Euler(numb, primes) {
    if (primes == undefined) {
        primes = PrimeFactors(numb);
    }
    var p = 1;
    primes.forEach((v) => { p *= v; });
    console.assert(p == numb, "Prime factors product equals given number");
    var ret = 1;
    for (var i = 0; i < primes.length; i++) {
        var prime = primes[i];
        var pow = 1;
        for (var j = i + 1; j < primes.length; j++) {
            if (primes[j] == prime) {
                pow++;
                i++;
            }
            else {
                break;
            }
        }
        ret *= Math.pow(prime, pow - 1) * (prime - 1);
    }
    return ret;
}
console.log("Copyright (c) 2019 Gleb Kosiachenko\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.");
/**
 * 
 * @param {Array<Number>} factorization 
 * @returns {Array<Array<Number>>}
 */
function PoweredPrimeFactors(factorization) {
    var mid = factorization.map((v) => { return [v, 1]; });
    for (var i = 0; i < mid.length; i++) {
        var pow = 1;
        var init = i;
        for (var j = i + 1; j < mid.length; j++) {
            if (mid[i][0] == mid[j][0]) {
                pow++;
                i++;
            }
        }
        for (var j = init; j <= i; j++) {
            mid[j][1] = pow;
        }
    }
    var ret = [];
    mid.forEach((v) => {
        var contains = false;
        ret.forEach((rv) => {
            if (rv[0] == v[0]) {
                contains = true;
            }
        });
        if (!contains)
            ret.push(v);
    });
    return ret;
}

/**
 * 
 * @param {Array<Number>} numbs 
 */
function LCM(numbs) {
    var primeFactorizations = [];
    var primes = [];
    //TODO: use PoweredPrimeFactors function
    numbs.forEach((v) => { primeFactorizations.push(PrimeFactors(v)); });
    primeFactorizations.forEach((factors) => {
        factors.forEach((v) => {
            var contains = false;
            for (var i = 0; i < primes.length; i++) {
                if (primes[i] == v) {
                    contains = true;
                    break;
                }
            }
            if (!contains) {
                primes.push(v);
            }
        });
    }); //select distinct prime factors into primes
    pows = primes.map((v) => {
        var maxpow = 1;
        primeFactorizations.forEach((factors) => {
            var pow = 0;
            factors.forEach((factor) => {
                if (factor == v) pow++;
            });
            if (pow > maxpow) maxpow = pow;
        });
        return maxpow;
    }); //count maximum powers for each prime factor from each factorization 
    var lcm = 1;
    for (var i = 0; i < pows.length && i < primes.length; i++) {
        lcm *= Math.pow(primes[i], pows[i]);
    }
    var divides = true;
    numbs.forEach((v) => {
        if (lcm % v != 0)
            divides = false;
    });
    console.assert(divides, "LCM is divisible by each of the given numbers");
    return lcm;
}

/**
 * 
 * @param {Number} numb 
 * @param {Array<Number>} primes
 */
function GenericEuler(numb, primes) {
    if (primes == undefined) {
        primes = PrimeFactors(numb);
    }
    var product = 1;
    primes.forEach((v) => { product *= v; });
    console.assert(product == numb);


    return LCM(PoweredPrimeFactors(primes).map((v) => {
        return Euler(Math.pow(v[0], v[1]));
    }));
}
/**
 * 
 * @param {Number} modulo 
 */
function MakeMultiplicativeGroup(modulo, factorization) {

    if (factorization == undefined) {
        factorization = PoweredPrimeFactors(PrimeFactors(modulo));
    } else {
        var prod = 1;
        factorization.forEach((v) => { prod *= Math.pow(v[0], v[1]); });
        if (prod != modulo) {
            factorization = PoweredPrimeFactors(PrimeFactors(modulo));
        }
    }

    var group = [1];
    for (var i = 2; i < modulo; i++) {
        var divides = false;
        factorization.forEach((v) => {
            if (i % v[0] == 0)
                divides = true;
        });
        if (!divides) {
            group.push(i);
        }
    }
    return group;
}

/**
 * 
 * @param {Array<T>} arr 
 * @param {function} less 
 */
function Sort(arr, less) {
    if (less == undefined)
        less = (lhs, rhs) => { return lhs < rhs; };
    for (var i = 0; i < arr.length; i++) {
        var min = i;
        for (var j = i + 1; j < arr.length; j++) {
            if (less(arr[j], arr[min])) {
                min = j;
            }
        }
        var b = arr[i];
        arr[i] = arr[min];
        arr[min] = b;
    }
}

/**
 * 
 * @param {Array<Array<Number>>} groupWithOrders 
 */
function MakeMultiplicativeSubGroups(groupWithOrders) {
    var modulo = groupWithOrders[groupWithOrders.length - 1][0] + 1;
    var ret = [[1]];
    ret.pop();
    /**
 * 
 * @param {Array<Number>} arLeft 
 * @param {Array<Number>} arRight 
 */
    var compareArray = (arLeft, arRight) => {
        if (arLeft.length != arRight.length)
            return false;
        for (var i = 0; i < arLeft.length; i++) {
            if (arLeft[i] !== arRight[i])
                return false;
        }
        return true;
    }
    groupWithOrders.forEach((el) => {
        var n = el[0];
        var o = el[1];
        if (n == 1 || o == modulo - 1)
            return;

        var sg = [];

        for (var i = 1; i < o; i++) {
            sg.push(n);
            n = n * el[0] % modulo;
        }
        if (needTesting)
            console.assert(n == 1, "element in orderth power equals 1");
        sg.push(n);

        Sort(sg);
        var absent = true;
        ret.forEach((v) => {
            if (compareArray(v, sg))
                absent = false;
        });
        if (absent)
            ret.push(sg);

    });
    Sort(ret, (lhs, rhs) => { return lhs.length < rhs.length; });
    if (needTesting) {
        ret.forEach((group) => {
            group.forEach((v) => {
                var cont = false;
                groupWithOrders.forEach((el) => {
                    if (el[0] == v)
                        cont = true;
                });
                console.assert(cont, "Big group contains subgroup element " + v);
            });
        });

        var bigGroup = [];
        groupWithOrders.forEach((v) => { bigGroup.push(v[0]); });

        var vectorProduct = [];
        ret[ret.length - 1].forEach((bv) => {
            ret[0].forEach((sv) => {
                vectorProduct.push(bv * sv);
            });
        });
        vectorProduct = vectorProduct.map((v) => {
            v = v % modulo;
            while (v < 0)
                v += modulo;
            return v;
        });
        Sort(vectorProduct);
        // console.assert(compareArray(bigGroup, vectorProduct), "Big group is a product of small groups");
    }
    return ret;
}
/**
 * 
 * @param {Number} numb 
 */
function Divisors(numb) {
    var ret = [];
    for (var i = 1; i <= numb / 2; i++) {
        if (numb % i == 0)
            ret.push(i);
    }
    ret.push(numb);
    return ret;
}
/**
 * 
 * @param {Array<Array<Number>>} poweredFactorization 
 * @param {String} leadString 
 */
var StrFactorization = (poweredFactorization, leadString = "") => {
    poweredFactorization.forEach((v) => {
        leadString += " " + v[0] + "<sup>" + v[1] + "</sup>x";
    });
    leadString = leadString.substring(0, leadString.length - 1);
    return leadString;
}

var needTesting = true; //true to enable assertions
if (needTesting) {
    console.assert(Order(1, 17) == 1, "Order of 1");
    console.assert(Power(17, 0) == 1, "Power zero");
    console.assert(Power(17, 5, 23) == 21, "Power of 17");
    console.assert(Power(17, 6, 23) == 12, "Power of 17");
    console.assert(Power(17, 5, 23) == 21, "Power of 17");

    console.assert(MakeMultiplicativeGroup(11 * 13).length == Euler(11 * 13), "length of multiplicative group equals Euler(modulus)");
    console.assert(MakeMultiplicativeGroup(7 * 5).length == Euler(7 * 5), "length of multiplicative group equals Euler(modulus)");
    console.assert(MakeMultiplicativeGroup(31).length == Euler(31), "length of multiplicative group equals Euler(modulus)");

    console.assert(Euler(15) == 8, "Unit testing");
    console.assert(Euler(1) == 0, "Unit testing");
    console.assert(Euler(8) == 4, "Unit testing");
    console.assert(Euler(21) == 12, "Unit testing");
    console.assert(Euler(16) == 8, "Euler 16");
    console.assert(Euler(81) == 54, "Euler 81");
    console.assert(Euler(253) == 220, "Euler 253");
    console.assert(Euler(110) == 40, "Euler 110");

    /**
     * 
     * @param {Array<T>} lhs 
     * @param {Array<T>} rhs 
     * @param {function} pred
     */
    var arrcmp = (lhs, rhs, pred = (l, r) => { return l == r; }) => {
        if (lhs.length != rhs.length)
            return false;

        for (var i = 0; i < lhs.length; i++) {
            if (!pred(lhs[i], rhs[i]))
                return false;
        }
        return true;
    }
    console.assert(arrcmp(PoweredPrimeFactors(PrimeFactors(72)), [[2, 3], [3, 2]], arrcmp));
    console.assert(arrcmp(PoweredPrimeFactors(PrimeFactors(32)), [[2, 5]], arrcmp));

    console.assert(LCM([3, 15]) == 15, "LCM 3 15");
    console.assert(LCM([1, 1]) == 1, "LCM 1 1");
    console.assert(LCM([16, 16]) == 16, "LCM 16 16");
    console.assert(LCM([10, 15]) == 30, "LCM 10 15");
    console.assert(LCM([12, 7]) == LCM([7, 12]), "LCM order");
    console.assert(LCM([8, 7, 14, 24]) == LCM([24, 7, 8, 14]), "multiple LCM oreder");

    console.assert(GenericEuler(35) == 12, "Generic Euler 35");
    console.assert(GenericEuler(110) == 20, "Generic Euler 110");
    console.assert(GenericEuler(253) == 110, "Generic Euler 110");
    console.assert(GenericEuler(209) == 90, "Generic Euler 209");
    console.assert(GenericEuler(90) == 12, "Generic Euler 90");
    console.assert(GenericEuler(2) == 1, "Generic Euler 2");
    console.assert(GenericEuler(5) == 4, "Generic Euler 5");
    console.assert(GenericEuler(125) == Euler(125), "Generic Euler 125");

    console.assert(arrcmp(PrimeFactors(1), [1]), "Prime factors of 1");
    console.assert(arrcmp(PrimeFactors(6), [2, 3]), "Prime factors of 6");
    console.assert(arrcmp(PrimeFactors(4), [2, 2]), "Prime factors of 4");
    console.assert(arrcmp(PrimeFactors(16), [2, 2, 2, 2]), "Prime factors of 16");
    console.assert(arrcmp(PrimeFactors(19), [19]), "Prime factors of 19");
    console.assert(arrcmp(PrimeFactors(121), [11, 11]), "Prime factors of 121");


}