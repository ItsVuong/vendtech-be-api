function isEmail(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.match(regex) ? true : false;
}

function validateGuestInfo(guestInfo){
    const error = {};
    // if(!Object.keys(guestInfo).length){
    //     error.body = "Request body cannot be empty";
    // }

    if(!guestInfo.firstName){
        error.firstName = "First name is invalid";
    }
    if(!guestInfo.lastName){
        error.lastName = "Last name is invalid";
    }
    if(!guestInfo.email || !isEmail(guestInfo.email)){
        error.email = "Email is invalid";
    }
    if(!guestInfo.message){
        error.message = "Message is invalid"
    }
    if(guestInfo.message && guestInfo.message.length > 2500){
        error.message = "Message too long"
    }

    return error;
}

function validateUser(user){
    const error = {};

    if(!user.username){
        error.username = "Username cannot be empty";
    }
    if(!user.email){
        error.password = "Password cannot be empty";
    }
    if(!user.email || !isEmail(user.email)){
        error.email = "Email is invalid";
    }

    return error;
}

function validateUserAuthenticate(userAuth){
    const error = {};

    if(!userAuth.username){
        error.username = "Username cannot be empty";
    }
    if(!userAuth.email){
        error.password = "Password cannot be empty";
    }

    return error;
}

module.exports = {
    validateGuestInfo,
    validateUser,
    validateUserAuthenticate
}