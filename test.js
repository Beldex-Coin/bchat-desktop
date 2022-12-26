let a = { ip: '128.0.0.0.1' };

let check = [{ ip: '127.0.0.0.1' }, { ip: '128.0.0.0.1' }, { ip: '128.0.0.0.1' }];

let c = check.find(validate => validate.ip == a.ip);
let d = c ? true : false;
console.log(c, d);
