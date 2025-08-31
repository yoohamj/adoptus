/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onCreatePost(filter: $filter, owner: $owner) {
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
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onUpdatePost(filter: $filter, owner: $owner) {
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
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onDeletePost(filter: $filter, owner: $owner) {
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
export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onCreateUserProfile(filter: $filter, owner: $owner) {
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
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onUpdateUserProfile(filter: $filter, owner: $owner) {
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
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onDeleteUserProfile(filter: $filter, owner: $owner) {
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
export const onCreateUserActivity = /* GraphQL */ `
  subscription OnCreateUserActivity(
    $filter: ModelSubscriptionUserActivityFilterInput
    $owner: String
  ) {
    onCreateUserActivity(filter: $filter, owner: $owner) {
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
export const onUpdateUserActivity = /* GraphQL */ `
  subscription OnUpdateUserActivity(
    $filter: ModelSubscriptionUserActivityFilterInput
    $owner: String
  ) {
    onUpdateUserActivity(filter: $filter, owner: $owner) {
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
export const onDeleteUserActivity = /* GraphQL */ `
  subscription OnDeleteUserActivity(
    $filter: ModelSubscriptionUserActivityFilterInput
    $owner: String
  ) {
    onDeleteUserActivity(filter: $filter, owner: $owner) {
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
export const onCreatePet = /* GraphQL */ `
  subscription OnCreatePet(
    $filter: ModelSubscriptionPetFilterInput
    $owner: String
  ) {
    onCreatePet(filter: $filter, owner: $owner) {
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
export const onUpdatePet = /* GraphQL */ `
  subscription OnUpdatePet(
    $filter: ModelSubscriptionPetFilterInput
    $owner: String
  ) {
    onUpdatePet(filter: $filter, owner: $owner) {
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
export const onDeletePet = /* GraphQL */ `
  subscription OnDeletePet(
    $filter: ModelSubscriptionPetFilterInput
    $owner: String
  ) {
    onDeletePet(filter: $filter, owner: $owner) {
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
export const onCreateConversation = /* GraphQL */ `
  subscription OnCreateConversation(
    $filter: ModelSubscriptionConversationFilterInput
  ) {
    onCreateConversation(filter: $filter) {
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
export const onUpdateConversation = /* GraphQL */ `
  subscription OnUpdateConversation(
    $filter: ModelSubscriptionConversationFilterInput
  ) {
    onUpdateConversation(filter: $filter) {
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
export const onDeleteConversation = /* GraphQL */ `
  subscription OnDeleteConversation(
    $filter: ModelSubscriptionConversationFilterInput
  ) {
    onDeleteConversation(filter: $filter) {
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
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $owner: String
  ) {
    onCreateMessage(filter: $filter, owner: $owner) {
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
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $owner: String
  ) {
    onUpdateMessage(filter: $filter, owner: $owner) {
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
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $owner: String
  ) {
    onDeleteMessage(filter: $filter, owner: $owner) {
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
export const onCreateConversationRead = /* GraphQL */ `
  subscription OnCreateConversationRead(
    $filter: ModelSubscriptionConversationReadFilterInput
    $userId: String
  ) {
    onCreateConversationRead(filter: $filter, userId: $userId) {
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
export const onUpdateConversationRead = /* GraphQL */ `
  subscription OnUpdateConversationRead(
    $filter: ModelSubscriptionConversationReadFilterInput
    $userId: String
  ) {
    onUpdateConversationRead(filter: $filter, userId: $userId) {
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
export const onDeleteConversationRead = /* GraphQL */ `
  subscription OnDeleteConversationRead(
    $filter: ModelSubscriptionConversationReadFilterInput
    $userId: String
  ) {
    onDeleteConversationRead(filter: $filter, userId: $userId) {
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
