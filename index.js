var data = [];

for (var i = 0; i < 9000; i++) {
    data[i] = 0.5;
}

var code = 'gl_FragColor = val;'

gpgpu(code, data);
