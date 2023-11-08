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
    // likes:{
    //   type: Schema.Types.ObjectId,
    //   ref: "Like",
    //   default: null,
    // }
}, {
    versionKey: false,
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Tweet", tweetSchema);
