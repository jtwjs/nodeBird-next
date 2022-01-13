const express = require('express');
const router = express.Router();
const { Post, Hashtag, Image, Comment, User } = require('../models');
const { Op } = require('sequelize');

router.get('/:hashtag', async (req, res, next) => {
	try {
		const where = {};
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
				model: Hashtag,
				where: { name: decodeURIComponent(req.params.hashtag) },
			},{
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