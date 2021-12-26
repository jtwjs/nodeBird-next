const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = () => {
	passport.use(new LocalStrategy({ // req body 설정
		usernameField: 'email', // req.body.email
		passwordField: 'password', // req.body.password
	}, async (email, password, done) => {
		try {
				const user = await User.findOne({
			where: { email }
		})

		if (!user) {
			// done(서버에러, 성공, 클라이언트에러)
			return done(null, false, { reason: '존재하지 않는 이메일입니다.'})
		}
		// 사용자가 입력한 비밀번호와 DB 비밀번호 비교
		const result = await bcrypt.compare(password, user.password);
		if (result) {
			return done(null, user);
		}
		return done(null, false, { reason: '비밀번호가 틀렸습니다.'});
	 	} catch (err) {
			console.error(err);
			return done(err);
		}
	}));
}