import React, {useState, useCallback} from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {Form, Input, Button} from 'antd';

const LoginForm = ({setIsLoggedIn}) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const onChangeId = useCallback((e) => {
    setId(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onSubmitForm = useCallback((e) => {
    console.log(id, password);
    setIsLoggedIn(true);
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
          onChange={onChangePassword}
          required
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