let keys = require('web-push').generateVAPIDKeys();
process.stdout.write(`vapidPr=${keys.privateKey}`);
process.stdout.write('\n');
process.stdout.write(`vapidPu=${keys.publicKey}`);
process.stdout.write('\n');