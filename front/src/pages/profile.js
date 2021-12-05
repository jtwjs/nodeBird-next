import React from 'react';
import Head from "next/head";

import AppLayout from "../layout/AppLayout";

const Profile = () => {
	return (
		<>
			<Head>
	      <meta charSet="utf-8" />
	      <title>내 프로필 | NodeBird</title>
      </Head>
			<AppLayout>Hello, Profile</AppLayout>
		</>
	)
}

export default Profile;