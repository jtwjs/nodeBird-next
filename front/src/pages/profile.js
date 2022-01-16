import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Router from "next/router";
import { useSelector, useDispatch } from "react-redux";
import useSWR from "swr";
import axios from "axios";

import AppLayout from "../layout/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
// import {LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST} from "../reducers/user";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  // const dispatch = useDispatch();
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);
  const { me } = useSelector((state) => state.user);

  const { data: followersData, error: followersError } = useSWR(
    `http://localhost:3065/user/followers?limit=${followersLimit}`,
    fetcher
  );
  const { data: followingsData, error: followingsError } = useSWR(
    `http://localhost:3065/user/followings?limit=${followingsLimit}`,
    fetcher
  );

  // useEffect(() => {
  // 	dispatch({
  // 		type: LOAD_FOLLOWERS_REQUEST,
  // 	});
  // 	dispatch({
  // 		type: LOAD_FOLLOWINGS_REQUEST,
  // 	})
  // }, []);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  });

  if (followingsError || followersError) {
    console.error(followersError || followingsError);
    // return이 hooks 보다 위에 있을수 없다.
    return <div>팔로잉/팔로워 로딩 중 에러가 발생</div>;
  }

  if (!me) {
    return "내 정보 로딩중...";
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList
          header="팔로잉 목록"
          data={followingsData}
          onClickMore={loadMoreFollowings}
          loading={!followingsData && !followingsError}
        />
        <FollowList
          header="팔로워 목록"
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={!followersData && !followersError}
        />
      </AppLayout>
    </>
  );
};

export default Profile;