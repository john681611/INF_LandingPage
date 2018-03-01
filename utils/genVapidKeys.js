let keys = require('web-push').generateVAPIDKeys();
process.stdout.write(keys.privateKey);
process.stdout.write('\n');
process.stdout.write(keys.publicKey);
process.stdout.write('\n');