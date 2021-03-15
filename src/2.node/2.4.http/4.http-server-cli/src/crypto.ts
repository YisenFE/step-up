
import crypto from 'crypto';

const r = crypto.createHash('sha1').update('123456').digest('base64');

console.log(r);


