const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();
db.sequelize.sync()
  .then(() => console.log('db 연결 성공'))
  .catch(console.error);

passportConfig();

// CORS 라이브러리
// res.setHeader('Access-Control-Allow-Origin', '*')
app.use(cors({
	origin: true, // 보낸곳의 주소가 자동으로 들어감
	credentials: false, // default false
}));
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

app.get('/api', (req, res) => {
  res.send('hello api');
})

app.get('/api/posts', (req, res) => {
  res.json([
    {id: 1, content: 'hello'},
    {id: 2, content: 'hello2'},
    {id: 3, content: 'hello3'},
  ]);
});

app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(3065, () => {
  console.log('Server running on port 3065');
})