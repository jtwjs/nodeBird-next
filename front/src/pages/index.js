import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {END} from 'redux-saga';
import axios from 'axios';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import AppLayout from '../Layout/AppLayout';
import wrapper from '../store/configureStore';
import {LOAD_POSTS_REQUEST} from "../reducers/post";
import {LOAD_MY_INFO_REQUEST} from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch();
  const {me} = useSelector(state => state.user);
  const {mainPosts, hasMorePosts, loadPostsLoading, retweetError} = useSelector(state => state.post);

  useEffect(() => {
    function onScroll() {
      if (Math.round(window.scrollY + document.documentElement.clientHeight) > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          })
        }
      }
    }

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError)
    }
  }, [retweetError])

  return (
    <AppLayout>
      {me && <PostForm/>}
      {mainPosts.map((c) => {
        return (
          <PostCard key={c.id} post={c}/>
        );
      })}
    </AppLayout>
  );
};

// 화면을 그리기 전에 서버쪽에서 먼저 실행
// context 안에 store가 들어있다.
export const getServerSideProps = wrapper.getServerSideProps((store) => async ({req, res, ...etc}) => {
	// 브라우저에서는 쿠키가 자동으로 header에 담겨서 보내지지지만
	// 서버에서는 직접 header에 쿠키를 담아서 보내야 한다.
	// 그러므로 프론트서버에서 직접 header에 쿠키를 설정하는 로직 작성
  const cookie = req ? req.headers.cookie : '';
  // 프론트서버에서 쿠키가 공유되는 문제 CUT
	// 프론트 서버도 서버기때문에 1개, 클라이언트는 ~++
	// 프론트 서버에서 axios.defaults.header.Cookie를 설정하게 되면
	// 모든 클라이언트는 이 프론트 서버를 거쳐서 백엔드 서버로 요청을 보내기에
	// 같은 쿠키가 적용되는 문제가 생긴다.
  axios.defaults.headers.Cookie = '';
  if (req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  store.dispatch({
    type: LOAD_POSTS_REQUEST
  })
  store.dispatch(END);
  await store.sagaTask.toPromise();
});

export default Home;