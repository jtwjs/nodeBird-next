const express = require('express');
const bcrypt = require('bcrypt');
const {User} = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
	try {
		const exUser = await User.findOne({
			where: {
				email: req.body.email,
			}
		});

		if(exUser) {
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

module.exports = router;