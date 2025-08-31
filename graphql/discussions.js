// GraphQL operations for Discussions (community forum)

export const createDiscussion = /* GraphQL */ `
  mutation CreateDiscussion($input: CreateDiscussionInput!) {
    createDiscussion(input: $input) {
      id
      community
      title
      body
      author
      authorId
      imageKeys
      score
      upvoters
      downvoters
      createdAt
      updatedAt
      lastActivityAt
    }
  }
`;

export const updateDiscussion = /* GraphQL */ `
  mutation UpdateDiscussion($input: UpdateDiscussionInput!) {
    updateDiscussion(input: $input) {
      id
      community
      title
      body
      imageKeys
      score
      upvoters
      downvoters
      updatedAt
      lastActivityAt
    }
  }
`;

export const deleteDiscussion = /* GraphQL */ `
  mutation DeleteDiscussion($input: DeleteDiscussionInput!) {
    deleteDiscussion(input: $input) { id }
  }
`;

export const getDiscussion = /* GraphQL */ `
  query GetDiscussion($id: ID!) {
    getDiscussion(id: $id) {
      id
      community
      title
      body
      author
      authorId
      imageKeys
      score
      upvoters
      downvoters
      createdAt
      updatedAt
      lastActivityAt
    }
  }
`;

export const listDiscussions = /* GraphQL */ `
  query ListDiscussions($limit: Int, $nextToken: String) {
    listDiscussions(limit: $limit, nextToken: $nextToken) {
      items {
        id
        community
        title
        body
        author
        authorId
        imageKeys
        score
        upvoters
        downvoters
        createdAt
        updatedAt
        lastActivityAt
      }
      nextToken
    }
  }
`;
