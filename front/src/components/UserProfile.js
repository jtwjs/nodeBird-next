import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Card, Avatar, Button} from 'antd';

import {logoutRequestAction} from '../reducers/user';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, isLoggingOut } = useSelector((state) => state.user)
  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  }, [])
  return (
    <Card
      actions={[
        <div key="text">쨱짹<br/>0</div>,
        <div key="following">팔로잉<br/>0</div>,
        <div key="follower">팔로워<br/>0</div>
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <Button onClick={onLogOut}>로그아웃</Button>
    </Card>
  )
}

export default UserProfile;