/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
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
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
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
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
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
export const createUserProfile = /* GraphQL */ `
  mutation CreateUserProfile(
    $input: CreateUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    createUserProfile(input: $input, condition: $condition) {
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
export const updateUserProfile = /* GraphQL */ `
  mutation UpdateUserProfile(
    $input: UpdateUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    updateUserProfile(input: $input, condition: $condition) {
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
export const deleteUserProfile = /* GraphQL */ `
  mutation DeleteUserProfile(
    $input: DeleteUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    deleteUserProfile(input: $input, condition: $condition) {
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
export const createUserActivity = /* GraphQL */ `
  mutation CreateUserActivity(
    $input: CreateUserActivityInput!
    $condition: ModelUserActivityConditionInput
  ) {
    createUserActivity(input: $input, condition: $condition) {
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
export const updateUserActivity = /* GraphQL */ `
  mutation UpdateUserActivity(
    $input: UpdateUserActivityInput!
    $condition: ModelUserActivityConditionInput
  ) {
    updateUserActivity(input: $input, condition: $condition) {
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
export const deleteUserActivity = /* GraphQL */ `
  mutation DeleteUserActivity(
    $input: DeleteUserActivityInput!
    $condition: ModelUserActivityConditionInput
  ) {
    deleteUserActivity(input: $input, condition: $condition) {
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
export const createPet = /* GraphQL */ `
  mutation CreatePet(
    $input: CreatePetInput!
    $condition: ModelPetConditionInput
  ) {
    createPet(input: $input, condition: $condition) {
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
export const updatePet = /* GraphQL */ `
  mutation UpdatePet(
    $input: UpdatePetInput!
    $condition: ModelPetConditionInput
  ) {
    updatePet(input: $input, condition: $condition) {
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
export const deletePet = /* GraphQL */ `
  mutation DeletePet(
    $input: DeletePetInput!
    $condition: ModelPetConditionInput
  ) {
    deletePet(input: $input, condition: $condition) {
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
export const createDiscussion = /* GraphQL */ `
  mutation CreateDiscussion(
    $input: CreateDiscussionInput!
    $condition: ModelDiscussionConditionInput
  ) {
    createDiscussion(input: $input, condition: $condition) {
      id
      owner
      author
      authorId
      community
      title
      body
      imageKeys
      score
      upvoters
      downvoters
      createdAt
      updatedAt
      lastActivityAt
      __typename
    }
  }
`;
export const updateDiscussion = /* GraphQL */ `
  mutation UpdateDiscussion(
    $input: UpdateDiscussionInput!
    $condition: ModelDiscussionConditionInput
  ) {
    updateDiscussion(input: $input, condition: $condition) {
      id
      owner
      author
      authorId
      community
      title
      body
      imageKeys
      score
      upvoters
      downvoters
      createdAt
      updatedAt
      lastActivityAt
      __typename
    }
  }
`;
export const deleteDiscussion = /* GraphQL */ `
  mutation DeleteDiscussion(
    $input: DeleteDiscussionInput!
    $condition: ModelDiscussionConditionInput
  ) {
    deleteDiscussion(input: $input, condition: $condition) {
      id
      owner
      author
      authorId
      community
      title
      body
      imageKeys
      score
      upvoters
      downvoters
      createdAt
      updatedAt
      lastActivityAt
      __typename
    }
  }
`;
export const createDiscussionComment = /* GraphQL */ `
  mutation CreateDiscussionComment(
    $input: CreateDiscussionCommentInput!
    $condition: ModelDiscussionCommentConditionInput
  ) {
    createDiscussionComment(input: $input, condition: $condition) {
      id
      discussionID
      owner
      author
      authorId
      body
      score
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateDiscussionComment = /* GraphQL */ `
  mutation UpdateDiscussionComment(
    $input: UpdateDiscussionCommentInput!
    $condition: ModelDiscussionCommentConditionInput
  ) {
    updateDiscussionComment(input: $input, condition: $condition) {
      id
      discussionID
      owner
      author
      authorId
      body
      score
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteDiscussionComment = /* GraphQL */ `
  mutation DeleteDiscussionComment(
    $input: DeleteDiscussionCommentInput!
    $condition: ModelDiscussionCommentConditionInput
  ) {
    deleteDiscussionComment(input: $input, condition: $condition) {
      id
      discussionID
      owner
      author
      authorId
      body
      score
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createConversation = /* GraphQL */ `
  mutation CreateConversation(
    $input: CreateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    createConversation(input: $input, condition: $condition) {
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
export const updateConversation = /* GraphQL */ `
  mutation UpdateConversation(
    $input: UpdateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    updateConversation(input: $input, condition: $condition) {
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
export const deleteConversation = /* GraphQL */ `
  mutation DeleteConversation(
    $input: DeleteConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    deleteConversation(input: $input, condition: $condition) {
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
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
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
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
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
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
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
export const createConversationRead = /* GraphQL */ `
  mutation CreateConversationRead(
    $input: CreateConversationReadInput!
    $condition: ModelConversationReadConditionInput
  ) {
    createConversationRead(input: $input, condition: $condition) {
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
export const updateConversationRead = /* GraphQL */ `
  mutation UpdateConversationRead(
    $input: UpdateConversationReadInput!
    $condition: ModelConversationReadConditionInput
  ) {
    updateConversationRead(input: $input, condition: $condition) {
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
export const deleteConversationRead = /* GraphQL */ `
  mutation DeleteConversationRead(
    $input: DeleteConversationReadInput!
    $condition: ModelConversationReadConditionInput
  ) {
    deleteConversationRead(input: $input, condition: $condition) {
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
