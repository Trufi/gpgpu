var bignum = require('bignum');

var b = bignum('3.243f6a8885a308d313198a2e03707344a4093822299f31d0082efa98ec4e6c89452821e638d01377be5466cf34e90c6cc0ac', 16);
console.log(b.toString(10));
