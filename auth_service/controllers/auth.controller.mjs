import ApiError from '../../global_router/exceptions/api.errors.mjs'; // Custom Api Errors
import authJwt from '../middleware/auth.jwt.mjs';
import bcrypt from 'bcryptjs';
import db from '../models/index.mjs';
import { v4 as uuidv4 } from 'uuid';
const Token = db.token;
const User = db.user;

const refresh = async (req, res, next) => {
  try {
    const token = await Token.findOne({ where: { token: req.cookies.refreshToken } });
    const { userId, username } = token;
    const user = { id: userId, user: username };
    const { accessToken, refreshToken } = authJwt.createToken(user);

    await Token.destroy({ where: { token: req.cookies.refreshToken } });
    await Token.create({ userId: user.id, username: user.user, token: refreshToken });

    res.cookie('refreshToken', refreshToken, { maxAge: 1000*60*60*24, httpOnly: true });
    res.status(200).send({ accessToken: accessToken });
  } catch (e) { next(e) };
};

const signin = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password) { throw ApiError.Unauthorized("DTO not found") };
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) { throw ApiError.Unauthorized("Invalid Username or Password") };

    const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
    if (!passwordIsValid) { throw ApiError.Unauthorized("Invalid Username or Password") };

    const { accessToken, refreshToken } = authJwt.createToken(user);
    const token = await Token.findOne({ where: { username: req.body.username } });
    if (token) { await Token.destroy({ where: { username: req.body.username } }) };

    await Token.create({ userId: user.id, username: user.username, token: refreshToken });
    
    user.getRoles().then(role => {
      res.cookie("refreshToken", refreshToken, { maxAge: 1000*60*60*24, httpOnly: true }); // 24h valid
      res.status(200).send({
        id: user.userId,
        username: user.username,
        email: user.email,
        role: role[0].name,
        accessToken: accessToken
      });
    });
  } catch (e) { next(e) };
};

const signup = async (req, res, next) => {
  try {
    const user = await User.create({ userId: uuidv4(), username: req.body.username, email: req.body.email, password: bcrypt.hashSync(req.body.password, 8) });
    user.setRoles([1]).then(() => { res.status(201).send({ message: "An Email sent to your account please verify." }) });
  } catch (e) { next(e) };
};

export const auth_controller = {
  refresh: refresh,
  signin: signin,
  signup: signup
};