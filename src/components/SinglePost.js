import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Grid,
  Image,
  Card,
  Button,
  Icon,
  Label,
  Form,
  Popup,
} from "semantic-ui-react";
import moment from "moment";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import { Link } from "react-router-dom";
import DeleteButton from "./DeleteButton";
export default function SinglePost(props) {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;
  const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId: postId },
  });
  debugger;
  const [comment, setComment] = useState("");
  const commentInputRef = useRef(null);
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    variables: {
      postId: postId,
      body: comment,
    },

    update() {
      debugger;
      setComment("");
      commentInputRef.current.blur();
    },
    onError(err) {
      debugger;
    },
  });

  function deleteCallback() {
    props.history.push("/");
  }
  if (loading) return <h1>Loading....</h1>;
  if (error) return <h1>{error}</h1>;
  let postMarkup;
  if (!data.getPost) postMarkup = <h1>Loading Posts</h1>;
  else {
    const {
      id,
      username,
      createdAt,
      likeCount,
      likes,
      body,
      commentCount,
      comments,
    } = data.getPost;
    debugger;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton
                  user={user}
                  post={{
                    id: id,
                    likes: likes,
                    likeCount: likeCount,
                  }}
                />
                <Popup
                  content="Comments"
                  trigger={
                    <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
                      <Button color="blue" basic>
                        <Icon name="comments" />
                      </Button>

                      <Label as="div" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  }
                  inverted
                />

                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deleteCallback} />
                )}
              </Card.Content>

              <hr />
            </Card>
            {user && user.username && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {user &&
              comments.map((comment) => (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                    {comment && comment.username === user.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                  </Card.Content>
                </Card>
              ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;
const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;
