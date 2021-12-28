exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		// next()의 사용방법 2가지
		// 1. 인자를 넣는다면 에러처리 미들웨어로
		// 2. 인자가 비어있으면 다음 미들웨어로 넘어감		next();
		next();
	} else {
		res.status(401).send('로그인이 필요합니다.');
	}
}

exports.isNotLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		next();
	} else {
		res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
	}
}