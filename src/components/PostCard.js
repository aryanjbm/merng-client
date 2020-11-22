import React, { useContext } from "react";
import { Card, Image, Label, Icon, Button, Popup } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
export default function PostCard({ post }) {
  console.log(post);
  const { user } = useContext(AuthContext);
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
        />
        <Card.Header>{post.username}</Card.Header>
        <Card.Meta>{moment(post.createdAt).fromNow()}</Card.Meta>
        <Card.Description>{post.body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton
          user={user}
          post={{
            id: post.id,
            likes: post.likes,
            likeCount: post.likeCount,
          }}
          inverted
        />

        <Popup
          content="Comment On Post"
          trigger={
            <Button labelPosition="right" as={Link} to={`/posts/${post.id}`}>
              <Button color="blue" basic>
                <Icon name="comments" />
              </Button>

              <Label as="div" pointing="left">
                {post.commentCount}
              </Label>
            </Button>
          }
          inverted
        />
        {user && user.username === post.username && (
          <DeleteButton postId={post.id} />
        )}
      </Card.Content>
    </Card>
  );
}
