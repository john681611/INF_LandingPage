const chai = require('chai');
let sinonChai = require('sinon-chai');
chai.use(require('chai-http'));
chai.use(require('chai-as-promised'));
chai.use(sinonChai);

global.expect = chai.expect;
global.chai = chai;
global.sinon = require('sinon');