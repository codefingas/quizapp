'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Mongoose/User"));
class AccountsController {
    async index({}) {
        return User_1.default.find();
    }
    async store({}) {
        const user = new User_1.default({
            email: Math.random().toString(36).substring(7),
            password: Math.random().toString(36).substring(7),
            username: Math.random().toString(36).substring(7),
            created_at: Math.random().toString(36).substring(7),
            updated_at: null,
            deleted_at: null,
        });
        const savedUser = await user.save();
        console.log(savedUser);
    }
}
exports.default = AccountsController;
//# sourceMappingURL=AccountsController.js.map