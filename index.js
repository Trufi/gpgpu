var data = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

var code = 'gl_FragColor = val * 3.0;';

var result = gpgpu(code, data, {
    dimension: 4
});

console.log(result);
