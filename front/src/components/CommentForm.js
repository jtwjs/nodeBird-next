import React, {useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';

import {addComment} from '../reducers/post';
import useInput from '../hooks/useInput';

const CommentForm = ({post}) => {
	const dispatch = useDispatch();
	const id = useSelector((state) => state.user.me?.id);
	const {addCommentLoading, addCommentDone} = useSelector((state) => state.post);
	const [commentText, onChangeCommentText, setCommentText] = useInput('');

	const onSubmitComment = useCallback(() => {
		dispatch(addComment({content: commentText, postId: post.id, userId: id}));
	}, [commentText]);

	useEffect(() => {
		if (addCommentDone) {
			setCommentText('');
		}
	}, [addCommentDone])

	return (
		<Form onFinish={onSubmitComment}>
		  <Form.Item style={{ position: 'relative', margin: 0}}>
			  <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4}/>
			  <Button
				  style={{ position: 'absolute', right: 0, bottom: -40, zIndex: 1}}
			    type="primary"
				  htmlType="submit"
				  loading={addCommentLoading}
			  >
				  삐약
			  </Button>
		  </Form.Item>
	  </Form>
	)
}

CommentForm.propTypes = {
	post: PropTypes.object.isRequired,
}

export default CommentForm;