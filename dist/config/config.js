"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    jwtSecret: process.env.JWT_SECRET || 'somesecrettoken',
    DB: {
        URI: process.env.MONGODB_URI || 'mongodb+srv://EduardoGC:poki2320@cluster0.opofziq.mongodb.net/?retryWrites=true&w=majority',
        USER: process.env.MONGODB_USER,
        PASSWORD: process.env.MONGODB_PASSWORD
    }
};
