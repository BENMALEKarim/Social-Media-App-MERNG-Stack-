const { UserInputError } = require('apollo-server');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validateRegisterInput, validateLoginInput }= require('../../util/validators');
const {SECRET_KEY} = require('../../config')
const User = require('../../models/User');

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = {
    Mutation: {

        async login(_, {username, password}){
            const {valid, errors} = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({username});

            if(!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }

            const match = await bcryptjs.compare(password, user.password);
            if(!match){
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };

        },

        async register(_, { registerInput: { username, email, password, confirm_password } }) {
            // Validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirm_password);

            if(!valid){
                throw new UserInputError('Errors', {errors});
            }
            //Make sure user doesn't already exist
            const existedUser = await User.findOne({username});
            if (existedUser){
                throw new UserInputError('Username is taken', {
                    error:{
                        username: 'This username is taken'
                    }
                })
            }
            //Hash password and create an auth token (using bcryptjs and jsonwebtoken)
            password = await bcryptjs.hash(password, 12);
            const user = new User({ email: email, username: username, password: password, createdAt: new Date().toISOString() });

            const res = await user.save();

            const token = generateToken(res);

            return{
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
}