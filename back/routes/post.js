const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // 파일시스템 조작할수 있는 모듈

const {Post, Image, User, Comment, Hashtag} = require('../models');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (err) {
  console.error(err);
  console.log('uploads 폴더가 없으므로 생성합니당');
  fs.mkdirSync('uploads');
}

// 이미지 업로드를 위한 library
const upload = multer({
  storage: multer.diskStorage({
    // 저장위치
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) { // 제로초.png
      const ext = path.extname(file.originalname); // 확장자 추출(png)
      const basename = path.basename(file.originalname, ext);
      done(null, basename + '_' + new Date().getTime() + ext); // 제로초1231252.png
    },
  }),
  limits: {fileSize: 20 * 1024 * 1024}, // 20MB
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      // findOrCreate db에 없다면 추가 있으면 추가하지 않음, where절 필수
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: {name: tag.slice(1).toLowerCase()},
      }))); // result === [[값, 중복유무불린값], [해쉬태그, true]]
      await post.addHashtags(result.map((v) => v[0]));
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // 이미지를 여러개 올리면 image: [이미지.png, 부기초.png]
        const images = await Promise.all(req.body.image.map((image) => Image.create({src: image})));
        await post.addImages(images);
      } else {
        // 이미지를 하나만 올리면 image: 이미지.png
        const image = await Image.create({src: req.body.image});
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: {id: post.id},
      include: [{
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User, // 댓글 작성자
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: User, // 게시글 작성자
        attributes: ['id', 'nickname'],
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      }]
    })
    res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: {id: req.params.postId},
    })
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }

    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.body.postId,
      UserId: req.user.id,
    })
    const fullComment = await Comment.findOne({
      where: {id: comment.id},
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }]
    })

    res.status(201).json(fullComment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [{ // post.Retweet 컬럼 생성
        model: Post,
        as: 'Retweet',
      }],
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }

    if( req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
    	return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
    }
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
	    where: {
	    	UserId: req.user.id,
		    RetweetId: retweetTargetId,
	    }
    });
    if (exPost) {
    	return res.status(403).send('이미 리트윗했습니다.');
    }
    const retweet = await Post.create({
	    UserId: req.user.id,
	    RetweetId: retweetTargetId,
	    content: 'retweet',
    });
    const retweetWithPrevPost = await Post.findOne({
	    // include가 아래처럼 너무 복잡해지면 db에서 불러오는 속도가 느려진다.
	    // route를 분리하는것이 좋아보임
	    where: {id: retweet.id },
	    include: [{
	    	model: Post,
		    as: 'Retweet',
		    include: [{
	    		model: User,
			    attributes: ['id', 'nickname'],
		    },
			    {
			      model: Image,
			    }]
	    }, {
	    	model: User,
		    attributes: ['id', 'nickname'],
	    }, {
	    	model: Image,
	    }, {
	    	model: Comment,
		    include: [{
	    		model: User,
			    attributes: ['id', 'nickname'],
		    }]
	    }, {
	    	model: User,
		    as: 'Likers',
		    attributes: ['id'],
	    }]
    })

    res.status(201).json(retweetWithPrevPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/:postId', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
   const fullPost = await Post.findOne({
	   where: {id: post.id},
	    include: [{
	    	model: Post,
		    as: 'Retweet',
		    include: [{
	    		model: User,
			    attributes: ['id', 'nickname'],
		    },
			    {
			      model: Image,
			    }]
	    }, {
	    	model: User,
		    attributes: ['id', 'nickname'],
	    }, {
	    	model: Image,
	    }, {
	    	model: Comment,
		    include: [{
	    		model: User,
			    attributes: ['id', 'nickname'],
		    }]
	    }, {
	    	model: User,
		    as: 'Likers',
		    attributes: ['id', 'nickname'],
	    }]
   })

    res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => { // PATCH /post/1/like
  try {
    const post = await Post.findOne({where: {id: req.params.postId}});
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.addLikers(req.user.id);
    res.json({PostId: post.id, UserId: req.user.id});
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: {id: req.params.postId}
    });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }

    await post.removeLikers(req.user.id);
    res.json({PostId: post.id, UserId: req.user.id});
  } catch (err) {
    console.error(err);
    next(err);
  }
})

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({ // sequelize에서 삭제 할때 사용
      where: {
        id: req.params.postId,
        UserId: req.user.id, // 본인 게시물만
      },
    });
    res.status(200).json({PostId: parseInt(req.params.postId, 10)});
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 여러장이면 array, 한장이면 single, json, text이면  none
// 이미지 업로드 되고 난 후
router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => {
  console.log(req.files);
  res.json(req.files.map((v) => v.filename));
})

module.exports = router;