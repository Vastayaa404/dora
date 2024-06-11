import ApiError from '../../router_service/middleware/api.errors.mjs';
import authJwt from './auth.jwt.mjs';
import db from '../models/index.mjs';
import nodemailer from 'nodemailer';
const User = db.user;

const checkDataIsValid = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) { throw ApiError.BadRequest("No Data Detected. Aborting") };

    if (typeof req.body.username !== 'string' || typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
      throw ApiError.BadRequest("Invalid req fields detected. Aborting") };

    if (req.body.username.length < 3 || req.body.email.length < 6 || req.body.password.length < 8) {
      throw ApiError.BadRequest("Invalid req fields detected (low length). Aborting") };

    if (!/(?=.*\d)(?=.*[a-zA-Z]).{8,}/.test(req.body.password)) {
      throw ApiError.BadRequest("Invalid req fields detected (invalid structure). Aborting") };

    next();
  } catch (e) { next(e) }
};

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } }); // If user exist on register stage
    if (user) { throw ApiError.BadRequest("Failed! Username is already in use!") };

    const mail = await User.findOne({ where: { email: req.body.email } }); // If email exist on register stage
    if (mail) { throw ApiError.BadRequest("Failed! Email is already in use!") };

    next();
  } catch (e) { next(e) };
};

const sendActivateLink = async (req, res, next) => {
  // Email send features !
  try {
    const date = new Date();
    const data = { "username": req.body.username, "created": date.toString() };
    const mailToken = authJwt.createMailToken(data);

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_DOMAIN,
      to: req.body.email,
      subject: "Verify Email",
      text: `Click on the link below to veriy your account: http://localhost:5000/api/auth/activate/${mailToken}`,
    });

    console.log("email sent successfully");
    next();
  } catch (e) { next(e) }
};

const isActivated = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.username } });
    if (user) { await User.update({ isActivated: true }, { where: { username: req.username } }) }

    res.status(200).send(`Verification is complete. Account is activated (${req.username}: account active? ${user.isActivated})`);
  } catch (e) { next(e) }
};

export default {
  checkDataIsValid: checkDataIsValid,
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  sendActivateLink: sendActivateLink,
  isActivated: isActivated
};