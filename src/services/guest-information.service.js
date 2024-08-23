const GuestInfo = require("../models/guest-information.model");

async function createGuestInfo({firstName, lastName, email, phoneNumber, message}){
    const guestInfo = new GuestInfo({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        message: message
    });
    return guestInfo.save();
}

async function getGuestInfo(pageSize, currentPage){
    const count = await GuestInfo.countDocuments({});
    const divide = Number(count/pageSize);
    const pages = Math.round(divide);

    if(currentPage >= pages){currentPage = pages}
    if(currentPage <= 0){currentPage = 1}
    const infos = await GuestInfo.find({}, null, 
        { limit: pageSize, skip: (currentPage - 1) * pageSize })
        .sort({createdAt: -1});

    return {
        data: infos,
        total: count
    };
}

async function deleteGuestInfoById(id){
    return GuestInfo.findByIdAndDelete(id);
}

module.exports = {
    createGuestInfo,
    getGuestInfo,
    deleteGuestInfoById
}