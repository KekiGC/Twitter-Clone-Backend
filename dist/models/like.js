"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const likeSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tweetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tweet",
        required: true,
    },
}, {
    versionKey: false,
});
exports.default = (0, mongoose_1.model)("Like", likeSchema);
