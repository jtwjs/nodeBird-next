const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const {User, Post} = require('../models');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		if (req.user) {
			const user = await User.findOne({
				where: {id: req.user.id}
			});

			const fullUserWithoutPassword = await User.findOne({
				where: {id: user.id},
				attributes: {
					exclude: ['password'],
				},
				include: [{
					model: Post,
					attributes: ['id'], // attribute 특정 데이터만 추출 또는 제외 가능
				}, {
					model: User,
					as: 'Followings',
					attributes: ['id'],
				}, {
					model: User,
					as: 'Followers',
					attributes: ['id'],
				}]
			})
			res.status(200).json(fullUserWithoutPassword);
		} else {
			res.status(200).json(null);
		}
	} catch (err) {
		console.error(err);
		next(err);
	}

});

router.post('/login', isNotLoggedIn, (req, res, next) => {
	// 미들웨어 확장방법 app.use(미들웨어) -> app.use((req, res, next) => { 미들웨어(req, res, next) })
	passport.authenticate('local', (err, user, info) => {
		// passport done 콜백이 전달된 것
		if (err) {
			console.error(err);
			return next(err);
		}
		if (info) {
			// 401 허가되지 않은것 (로그인이 잘못될때)
			// 403 금지 (허용되지 않은 요청)
			return res.status(401).send(info.reason);
		}
		// 실제 로그인 작업 (패스포트로 로그인 한번 더 -> passport.serializeUser가 실행됨)
		return req.login(user, async (loginErr) => {
			if (loginErr) {
				console.error(loginErr);
				return next(loginErr);
			}
			const fullUserWithoutPassword = await User.findOne({
				where: {id: user.id},
				attributes: {
					exclude: ['password'],
				},
				include: [{
					model: Post,
				}, {
					model: User,
					as: 'Followings',
				}, {
					model: User,
					as: 'Followers',
				}]
			})

			// res.setHeader('Cookie', 'dfsfsdf');
			return res.status(200).json(fullUserWithoutPassword);
		})
	})(req, res, next);
});

router.post('/', isNotLoggedIn, async (req, res, next) => {
	try {
		const exUser = await User.findOne({
			where: {
				email: req.body.email,
			}
		});

		if (exUser) {
			return res.status(403).send('이미 사용중인 아이디입니다.');
		}

		// 두번째 인자로 숫자를 받는데 높을수록 해쉬 암호화알고리즘이 빡세지는 대신 시간이 오래걸림
		// 보통 1초 정도 걸리는 시간으로 맞추는것이 좋다. [10 - 13]
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		await User.create({
			email: req.body.email,
			nickname: req.body.nickname,
			password: hashedPassword,
		});

		// res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060')
		res.status(200).send('ok'); // res.status(200).send('ok'); 생략가능하지만 붙이자
	} catch (err) {
		console.error(err);
		next(err); // next를 통해서 에러처리 미들웨어로 에러를 보냄  res.statis(500)
	}
});

router.post('/user/logout', isLoggedIn, (req, res) => {
	// 로그아웃
	req.logout();
	req.session.destroy();
	res.send('ok');
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
	try {
		await User.update({
			nickname: req.body.nickname,
		}, {
			where: { id: req.user.id },
		});
		res.status(200).json({ nickname: req.body.nickname })
	} catch (err) {
		console.error(err);
		next(err);
	}
})

module.exports = router;