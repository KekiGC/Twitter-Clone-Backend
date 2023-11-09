import { Router } from "express";
const router = Router();

import { signIn, signUp, changePassword, deleteUser, getUsers, editUser, searchUsers } from "../controllers/user.controller";

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/change-password', changePassword)
router.delete('/delete-user', deleteUser)
router.get('/get-users', getUsers)
router.put('/edit-user', editUser)
router.post('/search-users', searchUsers)

export default router;