import React, {useCallback} from 'react';
import {useSelector, useDispatch} from "react-redux";
import styled from 'styled-components';
import {Form, Input} from 'antd';
import useInput from "../hooks/useInput";
import {CHANGE_NICKNAME_REQUEST} from "../reducers/user";

const NicknameEditForm = () => {
	const { me } = useSelector((state) => state.user);
	const [nickname, onChangeNickname] = useInput(me?.nickname || '');
	const dispatch = useDispatch();

	const onSubmit = useCallback(() => {
		dispatch({
			type: CHANGE_NICKNAME_REQUEST,
			data: nickname,
		})
	}, [nickname])

  return (
    <Form
	    style={{ marginBottom: '20px', border: '1px solid #d9d9d9', padding: '20px'}}
    >
      <InputSearch
	      value={nickname}
	      onChange={onChangeNickname}
	      addonBefore="닉네임"
	      enterButton="수정"
	      onSearch={onSubmit}
      />
    </Form>
  )
}

export default NicknameEditForm;

const InputSearch = styled(Input.Search)`
  margin-bottom: 20px;
  border: 1px solid #d9d9d9;
  padding: 20px;
`;