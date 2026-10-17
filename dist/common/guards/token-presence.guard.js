"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPresenceGuard = void 0;
const common_1 = require("@nestjs/common");
let TokenPresenceGuard = class TokenPresenceGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userSub = this.getHeaderValue(request.headers['x-user-sub']);
        if (!userSub) {
            throw new common_1.UnauthorizedException('Authenticated user is required');
        }
        request.user = {
            sub: userSub,
            groups: this.parseGroups(request.headers['x-user-groups']),
        };
        return true;
    }
    getHeaderValue(value) {
        if (Array.isArray(value)) {
            return value[0];
        }
        return value;
    }
    parseGroups(value) {
        if (!value) {
            return [];
        }
        if (Array.isArray(value)) {
            return value;
        }
        return value
            .split(',')
            .map((group) => group.trim())
            .filter(Boolean);
    }
};
exports.TokenPresenceGuard = TokenPresenceGuard;
exports.TokenPresenceGuard = TokenPresenceGuard = __decorate([
    (0, common_1.Injectable)()
], TokenPresenceGuard);
//# sourceMappingURL=token-presence.guard.js.map