/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      owner
      image
      type
      title
      description
      price
      latitude
      longitude
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        image
        type
        title
        description
        price
        latitude
        longitude
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      id
      owner
      username
      email
      name
      birthdate
      city
      state
      country
      pictureKey
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        username
        email
        name
        birthdate
        city
        state
        country
        pictureKey
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const userProfilesByUsername = /* GraphQL */ `
  query UserProfilesByUsername(
    $username: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userProfilesByUsername(
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        username
        email
        name
        birthdate
        city
        state
        country
        pictureKey
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserActivity = /* GraphQL */ `
  query GetUserActivity($id: ID!) {
    getUserActivity(id: $id) {
      id
      owner
      event
      metadata
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUserActivities = /* GraphQL */ `
  query ListUserActivities(
    $filter: ModelUserActivityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserActivities(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        event
        metadata
        timestamp
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPet = /* GraphQL */ `
  query GetPet($id: ID!) {
    getPet(id: $id) {
      id
      owner
      petType
      petName
      breed
      age
      gender
      size
      color
      vaccinated
      spayedNeutered
      microchipped
      description
      ownerFirstName
      ownerLastName
      ownerEmail
      ownerPhone
      address
      city
      state
      zip
      specialNeeds
      preferences
      adoptionFee
      availableDate
      photoKeys
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPets = /* GraphQL */ `
  query ListPets(
    $filter: ModelPetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        petType
        petName
        breed
        age
        gender
        size
        color
        vaccinated
        spayedNeutered
        microchipped
        description
        ownerFirstName
        ownerLastName
        ownerEmail
        ownerPhone
        address
        city
        state
        zip
        specialNeeds
        preferences
        adoptionFee
        availableDate
        photoKeys
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getConversation = /* GraphQL */ `
  query GetConversation($id: ID!) {
    getConversation(id: $id) {
      id
      members
      petId
      petName
      lastMessageAt
      lastMessageText
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listConversations = /* GraphQL */ `
  query ListConversations(
    $filter: ModelConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConversations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        members
        petId
        petName
        lastMessageAt
        lastMessageText
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      id
      conversationID
      owner
      participants
      body
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        conversationID
        owner
        participants
        body
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const messagesByConversation = /* GraphQL */ `
  query MessagesByConversation(
    $conversationID: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByConversation(
      conversationID: $conversationID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        conversationID
        owner
        participants
        body
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getConversationRead = /* GraphQL */ `
  query GetConversationRead($id: ID!) {
    getConversationRead(id: $id) {
      id
      conversationID
      userId
      lastReadAt
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listConversationReads = /* GraphQL */ `
  query ListConversationReads(
    $filter: ModelConversationReadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConversationReads(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        conversationID
        userId
        lastReadAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
