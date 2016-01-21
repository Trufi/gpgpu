var data = [];

for (var i = 0; i < 9000; i++) {
    data[i] = 0.2;
}

var code = 'gl_FragColor = val * 2.0;'

gpgpu(code, data);
