import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import AppLayout from '../Layout/AppLayout';
import {LOAD_POSTS_REQUEST} from "../reducers/post";
import {LOAD_MY_INFO_REQUEST} from '../reducers/user';

const Home = () => {
	const dispatch = useDispatch();
	const {me} = useSelector(state => state.user);
	const {mainPosts, hasMorePosts, loadPostsLoading, retweetError} = useSelector(state => state.post);

	useEffect(() => {
		dispatch({
			type: LOAD_MY_INFO_REQUEST,
		})
		dispatch({
			type: LOAD_POSTS_REQUEST
		})
	}, []);

	useEffect(() => {
		function onScroll() {
			if (Math.round(window.scrollY + document.documentElement.clientHeight) > document.documentElement.scrollHeight - 300) {
				if (hasMorePosts && !loadPostsLoading) {
					console.log('load');
				dispatch({
					type: LOAD_POSTS_REQUEST
				})
				}
			}
		}
		window.addEventListener('scroll', onScroll);

		return () => {
			window.removeEventListener('scroll', onScroll);
		}
	}, [hasMorePosts, loadPostsLoading]);

	useEffect(() => {
  	if(retweetError) {
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

export default Home;