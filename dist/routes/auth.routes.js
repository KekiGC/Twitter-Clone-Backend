"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_controller_1 = require("../controllers/user.controller");
router.post('/signup', user_controller_1.signUp);
router.post('/signin', user_controller_1.signIn);
router.post('/change-password', user_controller_1.changePassword);
router.delete('/delete-user', user_controller_1.deleteUser);
router.get('/get-users', user_controller_1.getUsers);
router.put('/edit-user', user_controller_1.editUser);
router.post('/search-users', user_controller_1.searchUsers);
exports.default = router;
