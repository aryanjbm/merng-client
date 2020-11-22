import React from "react";
import { Button, Form } from "semantic-ui-react";

import { useForm } from "../util/hooks";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { FETCH_POSTS_QUERY } from "../util/grphql";

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, res) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      //data.getPosts = [res.data.createPost, ...data.getPosts];
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [res.data.createPost, ...data.getPosts],
        },
      });

      values.body = "";
    },
    onError: (err) => {
      //throw new Error(err);
    },
  });

  function createPostCallback() {
    createPost();
  }
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create A Post</h2>
        <Form.Field>
          <Form.Input
            placeholde="Say Something"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <li>{error.graphQLErrors[0].message}</li>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      commentCount
      username
      comments {
        id
        body
        username
      }
      likeCount
      likes {
        id
        username
      }
    }
  }
`;
export default PostForm;
