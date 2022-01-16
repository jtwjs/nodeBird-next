import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Card, Avatar, Button} from 'antd';

import {logoutRequestAction} from '../reducers/user';
import Link from "next/link";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user)
  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  }, [])

	console.log('me', me);
  return (
    <Card
      actions={[
        <div key="text"><Link href={`/user/${me.id}`}><a>쨱짹<br/>{me.Posts.length}</a></Link></div>,
        <div key="following"><Link href={`/profile`}><a>팔로잉<br/>{me.Followings.length}</a></Link></div>,
        <div key="follower"><Link href={`/profile`}><a>팔로워<br/>{me.Followers.length}</a></Link></div>
      ]}
    >
      <Card.Meta
        avatar={<Link href={`/user/${me.id}`}><a><Avatar>{me.nickname[0]}</Avatar></a></Link>}
        title={me.nickname}
      />
      <Button onClick={onLogOut} loading={logOutLoading}>로그아웃</Button>
    </Card>
  )
}

export default UserProfile;