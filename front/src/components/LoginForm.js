import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';
import {Form, Input, Button} from 'antd';

import {loginRequestAction} from '../reducers/user';
import useInput from '../hooks/useInput';

const LoginForm = () => {
  const dispatch = useDispatch();
  const {loginLoading, loginError} = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  useEffect(() => {
  	if (loginError){
  		alert(loginError);
	  }
  }, [loginError]);

  const onSubmitForm = useCallback(() => {
    dispatch(loginRequestAction({email, password}));
  }, [email, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <IdWrapper>
        <label htmlFor="user-email">이메일</label>
        <br/>
        <Input name="user-id" value={email} onChange={onChangeEmail} required/>
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
        <Button type="primary" htmlType="submit" loading={loginLoading}>로그인</Button>
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