// GraphQL queries for UserProfile and UserActivity

export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      id
      owner
      email
      name
      birthdate
      city
      state
      country
      pictureKey
      createdAt
      updatedAt
    }
  }
`;

export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles($limit: Int, $nextToken: String) {
    listUserProfiles(limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        email
        birthdate
        city
        state
        country
        createdAt
      }
      nextToken
    }
  }
`;

export const listUserActivities = /* GraphQL */ `
  query ListUserActivities($limit: Int, $nextToken: String, $filter: ModelUserActivityFilterInput) {
    listUserActivities(limit: $limit, nextToken: $nextToken, filter: $filter) {
      items {
        id
        owner
        event
        metadata
        timestamp
      }
      nextToken
    }
  }
`;

