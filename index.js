var data = [];

for (var i = 0; i < 9000; i++) {
    data[i] = i / 9000;
}

var code = 'gl_FragColor = val * 2.0;'

var res = gpgpu(code, data)
    .map(function(el) {
        return el * 9000;
    });

console.log(res);
