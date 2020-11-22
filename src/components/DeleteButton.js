import React, { useEffect, useState } from "react";
import { Label, Icon, Button, Confirm, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { FETCH_POSTS_QUERY } from "../util/grphql";
export default function DeleteButton({ postId, commentId, callback }) {
  const [confirm, setConfirm] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deleteCommentOrPost] = useMutation(mutation, {
    update(proxy) {
      setConfirm(false);
      if (!commentId) {
        let data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        const resPosts = data.getPosts.filter((p) => p.id !== postId);
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: [...resPosts],
          },
        });
      }
      //TODO:delete post from cache
      if (callback) callback();
    },
    variables: { postId, commentId },
  });

  return (
    <>
      <Popup
        content={commentId ? "Delete Comment" : "Delete Post"}
        trigger={
          <Button
            as="div"
            color="red"
            floated="right"
            onClick={() => setConfirm(true)}
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        }
        inverted
      />

      <Confirm
        open={confirm}
        onCancel={() => {
          setConfirm(false);
        }}
        onConfirm={deleteCommentOrPost}
      />
    </>
  );
}
const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
