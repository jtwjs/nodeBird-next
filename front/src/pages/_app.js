import Head from "next/head";
import PropTypes from "prop-types";

import "antd/dist/antd.css";
import wrapper from "../store/configureStore";

const NodeBird = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

// prop을 점검해주면 서비스에 안정성이 높아짐
NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(NodeBird);