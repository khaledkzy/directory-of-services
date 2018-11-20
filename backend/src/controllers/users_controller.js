import bcrypt from 'bcrypt';
import { transaction } from 'objection';
import Users from '../model/Users';

module.exports = {

  getAllUsers: () => Users.query(),

  getUsersById: userId =>
    Users.query().findById(userId),

  getUsersByEmail: (userEmail) =>
    Users.query().skipUndefined().where('email', userEmail),

  getUsersByVerified: (userVerified) =>
    Users.query().skipUndefined().where('verification_code', userVerified),

  updateUser: (userId, userData) =>
    Users.query().skipUndefined().where('id', userId).patch(userData),

  updateUserbyEmail: (userEmail, userData) =>
    Users.query().skipUndefined().where('email', userEmail).patch(userData),

  updateUserbyVerified: (verified, userData) =>
    Users.query().skipUndefined().where('verification_code', verified).patch(userData),

  deleteUser: userId =>
    Users.query().deleteById(userId),

  getUserByEmail: email =>
    Users.query().skipUndefined().where('email', email),

  validateResetInfo: (token, dateValue) =>
    Users.query().skipUndefined()
      .where('resetPasswordToken', token)
      .andWhere('resetPasswordExpires', '>', dateValue),

  addUser: userData =>
    transaction(Users.knex(), trx =>
      Users.query(trx)
        .insertGraph(userData)),

  comparePassword: (password, hash, callBack) =>
    bcrypt.compare(password, hash, (err, isMatch) => {
      if (err) throw err;
      callBack(null, isMatch)
    })
}
