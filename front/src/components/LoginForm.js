import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import {Form, Input, Button} from 'antd';

import {loginAction} from '../reducers/user';
import useInput from '../hooks/useInput';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [id, onChangeId] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmitForm = useCallback(() => {
    dispatch(loginAction({id, password}));
  }, [id, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <IdWrapper>
        <label htmlFor="user-id">아이디</label>
        <br/>
        <Input name="user-id" value={id} onChange={onChangeId} required/>
      </IdWrapper>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br/>
        <Input
          name="user-password"
          type="password"
          value={password}
          autoComplete="on"
          required
          onChange={onChangePassword}
        />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
        <Link href="/signup"><a>회원가입</a></Link>
      </ButtonWrapper>
    </FormWrapper>
  );
}

export default LoginForm;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const IdWrapper = styled.div`
  margin-top: 10px;
`;

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;