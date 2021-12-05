import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {List, Button, Card} from 'antd';
import {StopOutlined} from "@ant-design/icons";

const FollowList = ({header, data}) => {
  return (
    <StyledList
      grid={{gutter: 4, xs: 2, md: 3}}
      size="small"
      header={<div>{header}</div>}
      loadMore={<LoadMoreWrapper><Button>더 보기</Button></LoadMoreWrapper>}
      bordered
      dataSource={data}
      renderItem={(item) => (
        <ListItem>
          <Card actions={[<StopOutlined key="stop"/>]}>
            <Card.Meta description={item.nickname}/>
          </Card>
        </ListItem>
      )}
    />
  )
}

FollowList.propTypes =
{
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
}

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