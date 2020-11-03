const Post = require('../../models/Post');
const { Mutation } = require('./users');
const checkauth = require('../../util/checkauth');
const { AuthenticationError, UserInputError } = require('apollo-server');

module.exports = {
    Query: {

        async getPost(_, {postId}) {
            try {
                const post = await Post.findById(postId);
                if(post){
                    return post;
                } else{
                    throw new Error('Post not found');
                }
                
            }
            catch(err){
                throw new Error(err);
            }
        },

        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;

            } catch (err) {
                throw new Error(err);
            }
        }
    },

    Mutation :{
        async createPost(_, {body}, context){
            const user = checkauth(context);
            console.log(user);


            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();
            return post;
        },

        async deletePost(_, {postId}, context){
            const user = checkauth(context);
            try{
                const post = await Post.findById(postId);
                if(post.username === user.username){
                    post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch(err) {
                return new Error(err);
            }
        },

        async likePost(_, {postId}, context){
            const { username } = checkauth(context);

            const post = await Post.findById(postId);

            if(post){
                if(post.likes.find(like => like.username === username)){
                    post.likes = post.likes.filter(like => like.username != username);
                } else {
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    });
                }

                await post.save();
                return post;

            } else throw new UserInputError('Post not found');
        }
    }
};