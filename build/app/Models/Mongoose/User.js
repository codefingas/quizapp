"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ioc_Mongoose_1 = global[Symbol.for('ioc.use')]("Mongoose");
const UserSchema = new _ioc_Mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
    deleted_at: { type: Date, required: true },
});
exports.default = (0, _ioc_Mongoose_1.model)('User', UserSchema);
//# sourceMappingURL=User.js.map