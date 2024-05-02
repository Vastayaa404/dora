import ApiError from '../../global_router/exceptions/api.errors.mjs'; // Custom Api Errors
import db from '../models/index.mjs';
import jwt from 'jsonwebtoken';
const Token = db.token;
const User = db.user;

const createToken = (user, next) => {
  try {
    const accessToken = jwt.sign({ id: user.id, user: user.username }, process.env.JWT_ACCESS_KEY, 
      {
        algorithm: 'HS256',
        expiresIn: 3600, // 1h valid
        issuer: 'Dora authorization service'
      });
  
    const refreshToken = jwt.sign({ id: user.id, user: user.username }, process.env.JWT_REFRESH_KEY,
      {
        algorithm: 'HS256',
        expiresIn: 86400, // 24h valid
        issuer: 'Dora authorization service'
      });
  
      return { accessToken, refreshToken };
  } catch (e) { next(e) };
};

const createMailToken = (data, next) => {
  try {
    const mailToken = jwt.sign(data, process.env.JWT_MAIL_KEY,
      {
        algorithm: 'HS256',
        expiresIn: 600, // 10m valid
        issuer: 'Dora email service'
      });

      return mailToken;
  } catch (e) { next(e) };
};

const verifyAccessToken = (req, res, next) => {
  try {
    let token = req.headers["x-access-token"]; // Parse from localstorage with accessToken header
    if (!token) { throw ApiError.Forbidden("Access token not found!") };

    jwt.verify(token, process.env.JWT_ACCESS_KEY, { issuer: 'Dora authorization service' },
              (err, decoded) => {
                if (err) { throw ApiError.Forbidden("Token expired/invalid or issued by an unauthorized issuer") };
                req.userId = decoded.id;
                next();
              });
  } catch (e) { next(e) };
};

const verifyRefreshToken = (req, res, next) => { // Parse from httpOnly cookies automatically (if req withCredentials = true)
  try {
    let token = req.cookies.refreshToken;
    if (!token) { throw ApiError.Forbidden("Refresh token not found!") };

    jwt.verify(token, process.env.JWT_REFRESH_KEY, { issuer: 'Dora authorization service' },
              (err, decoded) => {
                if (err) { throw ApiError.Forbidden("Token expired/invalid or issued by an unauthorized issuer") };
                req.userId = decoded.id;

                Token.findOne({ where: { token: req.cookies.refreshToken } })
                .then(token => {  
                  if (!token) { throw ApiError.Forbidden("Token expired/invalid or issued by an unauthorized issuer") }
                  next();
                })
              });
  } catch (e) { next(e) };
};

const verifyMailToken = (req, res, next) => { // Parse from id url
  try {
    let token = req.params.id;
    if (!token) { throw ApiError.NotFound("Email token not found!") };

    jwt.verify(token, process.env.JWT_MAIL_KEY, { issuer: 'Dora email service' },
              (err, decoded) => {
                if (err) { throw ApiError.Forbidden("Verification link expired/invalid or issued by an unauthorized issuer") };
                req.username = decoded.username;
                req.created = decoded.created;
                next();
              });
  } catch (e) { next(e) };
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.userId) { throw ApiError.Forbidden("No User Detected. Aborting") };

    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles(); // get roles for finded user

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }

    throw ApiError.Forbidden("Require Admin Role!");
  } catch (e) { next(e) };
};

// Admin CMS Abilities // Dangerous !!!
const collectAllUsers = async (req, res, next) => {
  try {
    if(!req.userId) { throw ApiError.Forbidden("No User Detected. Aborting") };
    const users = await User.findAll();
    const uLength = await User.count();

    res.status(200).send({ users: users, count: uLength, clientIp: req.ip });
  } catch (e) { next(e) };
};

const collectAllTokens = async (req, res, next) => {
  try {
    if(!req.userId) { throw ApiError.Forbidden("No User Detected. Aborting") };
    const tokens = await Token.findAll();
    const tLength = await User.count();
    
    res.status(200).send({ tokens: tokens, count: tLength, clientIp: req.ip });
  } catch (e) { next(e) };
};

export default {
  createToken: createToken,
  createMailToken: createMailToken,
  verifyAccessToken: verifyAccessToken,
  verifyRefreshToken: verifyRefreshToken,
  verifyMailToken: verifyMailToken,
  isAdmin: isAdmin,
  collectAllUsers: collectAllUsers,
  collectAllTokens: collectAllTokens
};