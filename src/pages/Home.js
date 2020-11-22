import React, { useContext } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Grid, GridColumn, Image, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/grphql";

export default function Home() {
  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );
  const { user } = useContext(AuthContext);
  return (
    <Grid columns={3} divided>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && user.username && (
          <GridColumn>
            <PostForm />
          </GridColumn>
        )}
        {loading ? (
          <h1>loading posts</h1>
        ) : (
          <Transition.Group>
            {posts.length > 0 &&
              posts.map((post) => (
                // console.log(post)
                <GridColumn key={post.id}>
                  <PostCard post={post} />
                </GridColumn>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}
