import React, { useEffect, useState } from "react";
import { Label, Icon, Button, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
export default function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (
      user &&
      user.username &&
      likes &&
      likes.find((like) => like.username === user.username)
    ) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  });

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });
  const likeButton =
    user && user.username ? (
      liked ? (
        <Button color="teal" onClick={likePost}>
          <Icon name="heart" />
        </Button>
      ) : (
        <Button color="teal" basic onClick={likePost}>
          <Icon name="heart" />
        </Button>
      )
    ) : (
      <Button as={Link} to="/login" basic>
        <Icon name="heart" />
      </Button>
    );

  return (
    <Popup
      content="Like Post"
      trigger={
        <Button as="div" labelPosition="right">
          {likeButton}

          <Label as="div" pointing="left">
            {likeCount}
          </Label>
        </Button>
      }
      inverted
    />
  );
}
const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;
