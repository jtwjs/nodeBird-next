const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();
db.sequelize.sync()
  .then(() => console.log('db 연결 성공'))
  .catch(console.error);

passportConfig();
// morgan을 넣어주면 프론트에서 백엔드로 요청을 보낼 때 어떤 요청을 보냈는지 기록됨(디버깅)
app.use(morgan('dev'));
// CORS 라이브러리
// res.setHeader('Access-Control-Allow-Origin', '*')
app.use(cors({
	// access control allow origin
	origin: true, // 보낸곳의 주소가 자동으로 들어감
	// access control allow credentials
	// 다른 도메인간 (브라우저 3000, 서버 3005, 쿠키 공유)
	// 추가로 클라이언트에서는 axios에 withCredentials: true 설정해주어야함
	credentials: true, // default false
}));
// node에서는 __dirname + 'uploads' 방식보다는 path.join을 활용
// 운영체제마다 경로(경로구분자)가 다르기 떄문 e.g window => \uploads, mac => /uploads
// 운영체제에 맞게 알아서 써주는 path.join 활용
// '/' => localhost:3065
// express.static은 직접적인 정적파일 제공해주는 미들웨어
app.use('/', express.static(path.join(__dirname, 'uploads')));

// 프론트에서 넘어온 데이터(Http body message)를 req.body에 넣어주는 작업 코드
// 미들웨어라는게 위에서 아래 코드로 순서대로 실행되기 때문에 위에 미리 작성해주어야한다.
app.use(express.json()); // 프론트엔드에서 받은 데이터가 (형식 json)인 경우
app.use(express.urlencoded({ extended: true})); // 프론트엔드에서 받은 데이터가 폼 형식인 경우
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
	saveUninitialized: false,
	resave: false,
	secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
  res.send('hello express');
});

app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);

/*
express 내부적으로 app.use와 app.listen 사이에 error middleware가 존재
에러처리 미들웨어를 커스텀 할때
1. 에러 페이지를 따로 띄우고 싶다던가
2. 에러 처리에 특정한 정보를 뺴고 싶을 때
app.use((err, req, res, next) => {
});
 */

app.listen(3065, () => {
  console.log('Server running on port 3065');
})