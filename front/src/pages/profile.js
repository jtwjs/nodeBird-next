import React from 'react';
import Head from "next/head";

import AppLayout from "../layout/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";

const Profile = () => {
  const followerList = [{nickname: '넥스트'}, {nickname: '재밋네'}, {nickname: '고수가되고싶다'},];
  const followingList = [{nickname: '넥스트'}, {nickname: '재밋네'}, {nickname: '고수가되고싶다'},];

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={followingList}/>
        <FollowList header="팔로워 목록" data={followerList}/>
      </AppLayout>
    </>
  )
}

export default Profile;