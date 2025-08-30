// GraphQL mutation scaffold for creating a Pet record in AppSync.
// Ensure your Amplify schema includes a `Pet` @model that matches these fields,
// then run `amplify push` to generate the backend.

export const createPet = /* GraphQL */ `
  mutation CreatePet($input: CreatePetInput!) {
    createPet(input: $input) {
      id
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
    }
  }
`;

export const createUserProfile = /* GraphQL */ `
  mutation CreateUserProfile($input: CreateUserProfileInput!) {
    createUserProfile(input: $input) {
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

export const updateUserProfile = /* GraphQL */ `
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
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

export const createUserActivity = /* GraphQL */ `
  mutation CreateUserActivity($input: CreateUserActivityInput!) {
    createUserActivity(input: $input) {
      id
      owner
      event
      metadata
      timestamp
    }
  }
`;
