"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tweetSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isComment: {
        type: Boolean,
        default: false,
    },
    parentTweetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tweet",
        default: null,
    },
    attachment: {
        type: String,
        default: null,
    },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Like" }],
}, {
    versionKey: false,
    timestamps: true,
});
tweetSchema.pre("validate", function (next) {
    if (this.isComment && !this.parentTweetId) {
        throw new Error("A comment tweet must have a valid parentTweetId");
    }
    next();
});
exports.default = (0, mongoose_1.model)("Tweet", tweetSchema);
