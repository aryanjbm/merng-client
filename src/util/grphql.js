import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
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
