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

module.exports = {
    validateGuestInfo
}