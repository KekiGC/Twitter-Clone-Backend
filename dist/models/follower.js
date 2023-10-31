"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const followerSchema = new mongoose_1.Schema({
    followerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    followedId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    versionKey: false,
});
exports.default = (0, mongoose_1.model)("Tweet", followerSchema);
