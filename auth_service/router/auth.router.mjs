// Auth Router Module
// Connect all dependencies, middleware
import { auth_controller } from '../controllers/auth.controller.mjs';
import authJwt from '../middleware/auth.jwt.mjs';
import db from '../models/index.mjs';
import express from 'express';
import verifySignUp from '../middleware/verify.signup.mjs';
const router = express.Router();

try { db.sequelize.sync() } catch (e) { console.error(`Error while sync/connect to db: ${e}`) }; // db sync

/*db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    initial();
});
function initial() {
    db.role.create({
      id: 1,
      name: "user"
    });
   
    db.role.create({
      id: 2,
      name: "moderator"
    });
   
    db.role.create({
      id: 3,
      name: "admin"
    });
}*/

// user controller routes
router.get('/upload/image', [authJwt.verifyAccessToken, authJwt.isAdmin]);
router.get('/activate/:id', [authJwt.verifyMailToken, verifySignUp.isActivated]);
router.get('/control/users', [authJwt.verifyAccessToken, authJwt.isAdmin, authJwt.collectAllUsers]); // Endpoint for CMS
router.get('/control/tokens', [authJwt.verifyAccessToken, authJwt.isAdmin, authJwt.collectAllTokens]); // Endpoint for CMS

// auth controller routes
router.get('/refresh', [authJwt.verifyRefreshToken], auth_controller.refresh);
router.post('/signin', auth_controller.signin);
router.post('/signup', [verifySignUp.checkDataIsValid, verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.sendActivateLink], auth_controller.signup);

export default router;