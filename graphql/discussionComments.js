export const createDiscussionComment = /* GraphQL */ `
  mutation CreateDiscussionComment($input: CreateDiscussionCommentInput!) {
    createDiscussionComment(input: $input) {
      id
      discussionID
      author
      authorId
      body
      score
      createdAt
    }
  }
`;

export const updateDiscussionComment = /* GraphQL */ `
  mutation UpdateDiscussionComment($input: UpdateDiscussionCommentInput!) {
    updateDiscussionComment(input: $input) {
      id
      discussionID
      body
      score
      updatedAt
    }
  }
`;

export const deleteDiscussionComment = /* GraphQL */ `
  mutation DeleteDiscussionComment($input: DeleteDiscussionCommentInput!) {
    deleteDiscussionComment(input: $input) {
      id
    }
  }
`;

export const discussionCommentsByDiscussion = /* GraphQL */ `
  query DiscussionCommentsByDiscussion($discussionID: ID!, $limit: Int, $nextToken: String) {
    discussionCommentsByDiscussion(discussionID: $discussionID, sortDirection: ASC, limit: $limit, nextToken: $nextToken) {
      items {
        id
        discussionID
        author
        authorId
        body
        score
        createdAt
      }
      nextToken
    }
  }
`;

