module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirm_password
) => {
    const errors = {}

    if(username.trim() === ''){
        errors.username = 'Username must not be empty';
    }

    if (email.trim() === '') {
        errors.email = 'Username must not be empty';
    } else {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!email.match(regex)){
            errors.email = 'Email must be a valid email address';
        }
    }

    if (password.trim() === '') {
        errors.password = 'Password must not be empty';
    } else if (password != confirm_password){
        errors.confirm_password = 'Passwords must match';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1 
    }

};

module.exports.validateLoginInput = (
    username,
    password
) => {
    const errors = {}

    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }
    if (password.trim() === '') {
        errors.password = 'Password must not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}