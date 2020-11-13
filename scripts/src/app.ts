import fs from 'fs';
import * as path from 'path';

console.log('hello');
function handleFile(err: ErrnoException| null, data : Buffer) {
   console.log(err);
}

let passwd = fs.readFile('/etc/passwd', handleFile);
console.log(passwd);

