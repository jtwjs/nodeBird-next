import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {END} from 'redux-saga';
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