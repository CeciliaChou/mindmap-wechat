export const getLabelQuery = `query GetLabel($labelId: ID!) {
  query: getLabel(id: $labelId) {
    id
    name
  }
}`;

export const getSubscribedLabelsQuery = `query GetSubscribedLabels {
  query: getSubscribedLabels {
    id
    name
  }
}`;

export const getLabelQuestionsQuery = `query GetLabelQuestions($labelId: ID!, $cursor: String) {
  query: getLabel(id: $labelId) {
    id
    questions(nextToken: $cursor) {
      items {
        id
        title
        description
        createdAt
        creator {
          id
          login
          avatarUrl
        }
      }
      nextCursor: nextToken
    }
  }
}`;

export const getLabelIdeasQuery = `query GetLabelIdeas($labelId: ID!, $cursor: String) {
  query: getLabel(id: $labelId) {
    id
    ideas(nextToken: $cursor) {
      items {
        id
        description
        createdAt
        creator {
          id
          login
          avatarUrl
        }
      }
      nextCursor: nextToken
    }
  }
}`;

export const getQuestionIdeasQuery = `query GetQuestionIdeas($questionId: ID!, $cursor: String) {
  query: getQuestion(id: $questionId) {
    id
    addressedBy(nextToken: $cursor) {
      items {
        id
        description
        createdAt
        creator {
          id
          login
          avatarUrl
        }
      }
      nextCursor: nextToken
    }
  }
}`;

export const getIdeaQuestionsQuery = `query GetIdeaQuestions($ideaId: ID!, $cursor: String) {
  query: getIdea(id: $ideaId) {
    id
    addresses(nextToken: $cursor) {
      items {
        id
        title
        description
        createdAt
        creator {
          id
          login
          avatarUrl
        }
      }
      nextCursor: nextToken
    }
  }
}`;

export const subscribeToLabelQuery = `mutation SubscribeToLabel($labelId: ID!) {
  query: subscribeToLabel(labelId: $labelId) {
    id
    name
  }
}`;

export const unsubscribeToLabelQuery = `mutation UnsubscribeToLabel($labelId: ID!) {
  query: unsubscribeToLabel(labelId: $labelId) {
    id
    name
  }
}`;

export const createQuestionQuery = `mutation CreateQuestion($title: String!, $description: String) {
  query: createQuestion(title: $title, description: $description) {
    id
    title
    description
    createdAt
    creator {
      id
      login
      avatarUrl
    }
  }
}`;

export const createIdeaQuery = `mutation CreateIdea($description: String!) {
  query: createIdea(description: $description) {
    id
    description
    createdAt
    creator {
      id
      login
      avatarUrl
    }
  }
}`;

export const associateEntityWithLabelQuery = `mutation AssociateEntityWithLabel($entityId: ID!, $labelId: ID!, $entityType: EntityType!) {
  query: associateLabel(entityId: $entityId, labels: [$labelId], entityType: $entityType) {
    id
  }
}`;

export const addressQuestionQuery = `mutation AddressQuestion($questionId: ID!, $ideaId: ID!) {
  query: addressQuestion(questionId: $questionId, ideaId: $ideaId) {
    id
  }
}`;

export const getLabelByNameQuery = `query GetLabelByName($name: String!) {
  query: getLabelByName(name: $name) {
    id
  }
}`;

export const createLabelQuery = `mutation CreateLabel($name: String!) {
  query: createLabel(name: $name) {
    id
  }
}
`;
