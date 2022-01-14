'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const result = require('dotenv').config();
if (result.error) {
    throw result.error;
}
class MongoProvider {
    constructor(app) {
        this.app = app;
    }
    register() {
        const mongoose = require('mongoose');
        mongoose.connect(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.app.container.singleton('Mongoose', () => mongoose);
    }
    async boot() {
    }
    async ready() {
    }
    async shutdown() {
        await this.app.container.use('Mongoose').disconnect();
    }
}
exports.default = MongoProvider;
//# sourceMappingURL=MongoProvider.js.map