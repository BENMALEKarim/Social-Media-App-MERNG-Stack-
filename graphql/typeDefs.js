const { gql } = require('apollo-server'); 

module.exports = gql`
    type Post{
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
    }

    type User{
        id: ID! 
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }

    type Comment{
        id: ID!
        body: String!
        username: String!
        createdAt: String!
    }

    type Like{
        id: ID!
        username: String!
        createdAt: String!
    }

    input RegisterInput{
        username: String!
        password: String!
        confirm_password: String!
        email: String!
    }

    type Query{
        getPosts: [Post!]
        getPost(postId: ID!): Post!
    }

    type Mutation{
        register(registerInput: RegisterInput ): User!
        login(username: String!, password: String): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        addComment(body: String!, postId: ID!): Post!
        deleteComment(commentId: ID!, postId: ID!): Post!
        likePost(postId: ID!): Post!
    }

`