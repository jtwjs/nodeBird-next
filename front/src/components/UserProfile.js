import React, {useCallback} from 'react';
import {useDispatch} from "react-redux";
import {Card, Avatar, Button} from 'antd';

import {logoutAction} from '../reducers/user';

const UserProfile = () => {
	const dispatch = useDispatch();
  const onLogOut = useCallback(() => {
    dispatch(logoutAction());
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
        avatar={<Avatar>JTW</Avatar>}
        title="jtwjs"
      />
      <Button onClick={onLogOut}>로그아웃</Button>
    </Card>
  )
}

export default UserProfile;