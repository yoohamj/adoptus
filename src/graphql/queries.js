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
