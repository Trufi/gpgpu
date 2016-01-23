var data = [];
var data2 = [5,6,7,8,9, 10, 11, 12,13,14,15,16,17,18,19];

// for (var i = 0; i < 10000; i++) {
//     data2[i] = i % 90 + 3;
// }
// float(counterPrimeNumber) < val - 1.0
var code = `
    const int len = 300;
    const int primeNumbersLen = 100;
    int result;

    int primeNumbers[len];
    int counterPrimeNumber = 0;

    for (int j = 2; j < len; j++) {
        bool isComposite = false;

        for (int i = 0; i < primeNumbersLen; i++) {
            float modulo = mod(float(j), float(primeNumbers[i]));

            if (modulo == 0.0) {
                isComposite = true;
                break;
            }
        }

        if (!isComposite) {
            for (int k = 0; k < primeNumbersLen; k++) {
                if (k == counterPrimeNumber) {
                    primeNumbers[k] = j;
                    counterPrimeNumber++;
                    break;
                }
            }
        }

        if (float(counterPrimeNumber) > float(val - 2.0)) {
            result = j;
            break;
        }
    }

    gl_FragColor = vec4(result, 0.0, 0.0, 0.0);
`;

var code = `
    int tt = 0;
    for (int i = 0; i < 1000; i++) {
        if (float(i) > val.x) {
            break;
        }
        tt++;
    }
    gl_FragColor = vec4(tt, tt + 1, tt + 2, tt + 3);
`;

var res = gpgpu(code, data2, {
    dimension: 4
});

console.log(res);
