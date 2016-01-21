//(function() {

var positionArray = [
    -1, -1,
    1, -1,
    1, 1,
    -1, 1
];

var textureArray = [
    0, 0,
    1, 0,
    1, 1,
    0, 1
];

var indexArray = [
    1, 2, 0,
    3, 0, 2
];

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = 500;
canvas.height = 500;
var gl = canvas.getContext('webgl');
gl.viewport(0, 0, 500, 500);

if (!gl.getExtension('OES_texture_float')) {
    throw new Error('Requires OES_texture_float extension');
}

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionArray), gl.STATIC_DRAW);

var textureBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureArray), gl.STATIC_DRAW);

var indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);

var vertexShaderCode = [
    'attribute vec2 position;',
    'attribute vec2 texture;',
    'varying vec2 v_texture;',
    '',
    'void main(void) {',
    '  v_texture = texture;',
    '  gl_Position = vec4(position.xy, 0.0, 1.0);',
    '}'
].join('\n');

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderCode);
gl.compileShader(vertexShader);

if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
}

function getFragmentShaderCode(code) {
    return [
        'precision mediump float;',
        'uniform sampler2D u_texture;',
        'varying vec2 v_texture;',
        '',
        'void main(void) {',
        '  vec4 val = texture2D(u_texture, v_texture);',
        code, // gl_FragColor
        '}'
    ].join('\n');
}

function getTextureSize(data) {
    var pixels = data.length / 4;
    var sqr = Math.sqrt(pixels);
    var pow = Math.ceil(Math.log(sqr) / Math.log(2));
    return Math.pow(2, pow);
}

function createTexture(data, size) {
    var length = size * size * 4;

    if (data.length < length) {
        data[length - 1] = 0;
    }

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.FLOAT, new Float32Array(data));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
}

function frameBufferIsComplete() {
  var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  var message, value;

  switch (status) {
    case gl.FRAMEBUFFER_COMPLETE:
      value = true;
      break;
    case gl.FRAMEBUFFER_UNSUPPORTED:
      message = 'Framebuffer is unsupported';
      value = false;
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
      message = 'Framebuffer incomplete attachment';
      value = false;
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
      message = 'Framebuffer incomplete (missmatched) dimensions';
      value = false;
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
      message = 'Framebuffer incomplete missing attachment';
      value = false;
      break;
    default:
      message = 'Unexpected framebuffer status: ' + status;
      value = false;
  }
  return {isComplete: value, message: message};
};

window.gpgpu = function(code, data) {
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, getFragmentShaderCode(code));
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(fragmentShader));
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log('Could not initialize shaders');
    }

    var uTexture = gl.getUniformLocation(program, 'u_texture');
    var aPosition = gl.getAttribLocation(program, 'position');
    var aTexture = gl.getAttribLocation(program, 'texture');

    gl.useProgram(program);

    var size = getTextureSize(data);
    var texture = createTexture(data, size);

    var frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    console.log(frameBufferIsComplete());

    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(uTexture, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.enableVertexAttribArray(aTexture);
    gl.vertexAttribPointer(aTexture, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    var result = new Float32Array(size * size * 4);
    //gl.readPixels(0, 0, size, size, gl.RGBA, gl.FLOAT, result);
    //gl.readPixels(0, 0, size, size, gl.RGBA, gl.FLOAT, result);
    console.log(result);
    return result;
};

//})();
