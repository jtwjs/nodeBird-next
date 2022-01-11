import Head from 'next/head';
import {useRouter} from "next/router";
import {END} from 'redux-saga';
import {useSelector} from "react-redux";

import wrapper from '../../store/configureStore';
import {LOAD_MY_INFO_REQUEST} from "../../reducers/user";
import {LOAD_POST_REQUEST} from "../../reducers/post";
import AppLayout from "../../layout/AppLayout";
import PostCard from "../../components/PostCard";

const Post = () => {
	const router = useRouter();
	const {id} = router.query;
  const {post} = useSelector((state) => state.post);

  return (
    <AppLayout>
      <Head>
        <title>
	        {post.User.nickname}님의 글
        </title>
	      <meta name="description" content={post.content} />
	      <meta property="og:title" content={`${post.User.nickname}님의 게시글`} />
        <meta property="og:description" content={post.content} />
        <meta property="og:image" content={post.Images[0] ? post.Images[0].src : 'https://nodebird.com/favicon.ico'} />
        <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      <PostCard post={post}/>
    </AppLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({req, res, params, ...etc}) => {
  console.log('params', params);
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  store.dispatch({
    type: LOAD_POST_REQUEST,
    data: params.id,
  })
  store.dispatch(END);
  await store.sagaTask.toPromise();
});

export default Post;