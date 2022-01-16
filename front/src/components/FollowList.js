import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { List, Button, Card } from "antd";
import { StopOutlined } from "@ant-design/icons";
import { REMOVE_FOLLOWER_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

const FollowList = ({ header, data = null, onClickMore, loading }) => {
  const dispatch = useDispatch();

  const onCancel = (id) => () => {
    if (header === "팔로잉 목록") {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: id,
      });
    } else {
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: id,
      });
    }
    ``;
  };

  return (
    <StyledList
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      header={<div>{header}</div>}
      loadMore={
        <LoadMoreWrapper>
          <Button onClick={onClickMore} loading={loading}>
            더 보기
          </Button>
        </LoadMoreWrapper>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <ListItem>
          <Card
            actions={[<StopOutlined key="stop" onClick={onCancel(item.id)} />]}
          >
            <Card.Meta description={item.nickname} />
          </Card>
        </ListItem>
      )}
    />
  );
};

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onClickMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FollowList;

const StyledList = styled(List)`
  margin-bottom: 20px;
`;

const ListItem = styled(List.Item)`
  margin-top: 20px;
`;

const LoadMoreWrapper = styled.div`
  margin: 10px 0;
  text-align: center;
`;