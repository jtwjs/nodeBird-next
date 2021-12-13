import React, {useState, useRef, useCallback} from 'react';
import {Form, Input, Button} from 'antd';
import {useSelector, useDispatch} from 'react-redux';

import {addPost} from "../reducers/post";

const PostForm = () => {
	const dispatch = useDispatch();
	const {imagePaths} = useSelector((state) => state.post);
	const [text, setText] = useState('');
	const imageInput = useRef();

	const onChangeText = useCallback((e) => {
		setText(e.target.value);
	}, []);

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, [imageInput.current]);

	const onSubmit = useCallback(() => {
		setText('');
		dispatch(addPost(text));
	}, [text]);

	return (
		<Form style={{margin: '10px 0 20px'}} encType="multipart/form-data" onFinish={onSubmit}>
			<Input.TextArea
				value={text}
				maxLength={140}
				placeholder="어떤 신기한 일이 있었나요?"
				onChange={onChangeText}
			/>
			<div>
				<input type="file" multiple hidden ref={imageInput}/>
				<Button onClick={onClickImageUpload}>이미지 업로드</Button>
				<Button type="primary" style={{float: 'right'}} htmlType="submit">쨱쨱</Button>
			</div>
			<div>
				{imagePaths.map((v) => (
					<div key={v} style={{display: 'inline-block'}}>
						<img src={v} style={{width: '200px'}} alt={v}/>
						<div>
							<Button>제거</Button>
						</div>
					</div>
				))}
			</div>
		</Form>
	)
}

export default PostForm;