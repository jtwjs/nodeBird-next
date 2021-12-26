const passport = require('passport');
const local = require('./local');

const {User} = require('../models');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, User.id);
  });

  // 로그인 성공하고나서 그 다음 요청부터
	// 라우터 실행되기전에 매번 실행됨
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where : { id }});
      done(null, user); // req.user에 정보가 담김
    } catch (err) {
      console.error(err);
      done(err);
    }
  });

  local();
}