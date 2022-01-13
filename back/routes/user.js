const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');

const {User, Post} = require('../models');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/:userId', async (req, res, next) => {
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: {id: req.params.userId},
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
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      // 개인정보 침해 예방
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      res.status(200).json(data);
    } else {
      res.status(403).json('유령입니다.');
    }
  } catch (err) {
    console.error(err);
    next(err);
  }

});

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

router.post('/logout', isLoggedIn, (req, res) => {
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
      where: {id: req.user.id},
    });
    res.status(200).json({nickname: req.body.nickname})
  } catch (err) {
    console.error(err);
    next(err);
  }
})

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({where: {id: req.params.userId}});
    if (!user) {
      res.status(403).send('유령을 팔로우 하신다구요?')
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({UserId: parseInt(req.params.userId, 10)});

  } catch (err) {
    console.error(err);
    next(err);
  }
})

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({where: {id: req.params.userId}});
    if (!user) {
      res.status(403).send('유령을 언팔로우 하신다구요?')
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({UserId: parseInt(req.params.userId, 10)});
  } catch (err) {
    console.error(err);
    next(err);
  }
})

router.get('/followers', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({where: {id: req.user.id}});
    if (!user) {
      res.status(403).send('유령을 찾으시나요 ㅋ')
    }
    const followers = await user.getFollowers();
    res.status(200).json(followers);
  } catch (err) {
    console.error(err);
    next(err);
  }
})

router.get('/followings', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({where: {id: req.user.id}});
    if (!user) {
      res.status(403).send('유령을 찾으시나요 ㅋ')
    }
    const followings = await user.getFollowings();
    res.status(200).json(followings);
  } catch (err) {
    console.error(err);
    next(err);
  }
})

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({where: {id: req.params.userId}});
    if (!user) {
      res.status(403).send('유령을 차단하려고 하시네ㅋ')
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json(parseInt(req.params.userId, 10));
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/:userId/posts', async (req, res, next) => {
	try {
		const where = {UserId: req.params.userId};
		if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐때
			// 조건이 id가 lastId보다 작은것들 불러와라
			// Op.lt === 연산자 (보다 작은)
			where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
		}
		const posts = await Post.findAll({
			where,
			// 실무에서는 limit, offset 조합을 잘 쓰지 않는다
			// 치명적인 단점: 중간에 게시물이 추가, 삭제된다면 offset과 limit이 꼬이게됨
			// where: { id: lastId },// lastId는 중간에 게시물이 추가,삭제 되어도 고정이기 떄문에 위의 단점을 커버가능
			limit: 10, // 10개만 가져와라
			// offset: 0, // 0이면 1~10 || 10이면 11~20 || 100이면 101 ~ 110
			order: [
				['createdAt', 'DESC'],
				[Comment, 'createdAt', 'DESC']
			],
			include: [{
				model: User,
				attributes: {
					exclude: ['password'],
				},
			}, {
				model: Image,
			}, {
				model: Comment,
				include: [{
					model: User,
					attributes: ['id', 'nickname']
				}],
			}, {
				model: User,
				as: 'Likers',
				attributes: ['id'],
			},
			{
	    	model: Post,
		    as: 'Retweet',
		    include: [{
	    		model: User,
			    attributes: ['id', 'nickname'],
		    },
			    {
			    	model: Image,
			    }]
	    }]
		});
		res.status(200).json(posts);
	} catch (err) {
		next(err);
	}
})

module.exports = router;