"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ioc_Mongoose_1 = global[Symbol.for('ioc.use')]("Mongoose");
const DifficultySchema = new _ioc_Mongoose_1.Schema({
    name: { type: String, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
    deleted_at: { type: Date, required: true },
});
exports.default = (0, _ioc_Mongoose_1.model)('Difficulty', DifficultySchema);
//# sourceMappingURL=Difficulty.js.map