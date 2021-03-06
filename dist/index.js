'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _mongodb = require('mongodb');

var _graphql = require('graphql');

var _utilities = require('graphql/utilities');

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _ptzUserApp = require('ptz-user-app');

var _ptzUserRepository = require('ptz-user-repository');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

_dotenv2.default.config();

var app = (0, _express2.default)();
console.log('starting server');
var MONGO_URL = 'mongodb://localhost:27017/rideon',
    PORT = 3000;
(function () {
    return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee() {
        var db, userApp, schema, json;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return _mongodb.MongoClient.connect(MONGO_URL);

                    case 3:
                        db = _context.sent;
                        userApp = (0, _ptzUserApp.UserApp)((0, _ptzUserRepository.UserRepository)(db));
                        schema = (0, _schema2.default)(userApp);

                        app.use('/', (0, _expressGraphql2.default)({
                            schema: schema,
                            graphiql: true
                        }));
                        app.listen(PORT, function () {
                            return console.log('Listening on port ' + PORT);
                        });
                        _context.next = 10;
                        return (0, _graphql.graphql)(schema, _utilities.introspectionQuery);

                    case 10:
                        json = _context.sent;

                        fs.writeFile('./dist/schema.json', JSON.stringify(json, null, 2), function (err) {
                            if (err) throw err;
                            console.log('Json schema created!');
                        });
                        _context.next = 17;
                        break;

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context['catch'](0);

                        console.log(_context.t0);

                    case 17:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 14]]);
    }));
})();