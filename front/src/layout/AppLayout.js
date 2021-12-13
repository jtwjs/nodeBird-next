import React from 'react';
import {useSelector} from "react-redux";
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from "styled-components";
import {Menu, Input, Row, Col} from 'antd';

import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';

const AppLayout = ({children}) => {
	const {loginDone} = useSelector(state => state.user);

	return (
		<div>
			<Menu mode="horizontal">
				<Menu.Item key="0">
					<Link href="/"><a>노드버드</a></Link>
				</Menu.Item>
				<Menu.Item key="1">
					<Link href="/profile"><a>프로필</a></Link>
				</Menu.Item>
				<Menu.Item key="2">
					<SearchInput enterButton/>
				</Menu.Item>
				<Menu.Item key="3">
					<Link href="/signup"><a>회원가입</a></Link>
				</Menu.Item>
			</Menu>
			<Row gutter={8}>
				<Col xs={24} md={6}>
					{loginDone ? <UserProfile/> : <LoginForm/>}
				</Col>
				<Col xs={24} md={12}>
					{children}
				</Col>
				<Col xs={24} md={6}>
					<a href="https://www.github.com/jtwjs" target="_blank" rel="noreferrer noopener">Made by jtwjs</a>
				</Col>
			</Row>
		</div>
	)
};

AppLayout.propTypes = {
	children: PropTypes.node.isRequired,
}

export default AppLayout;

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;
