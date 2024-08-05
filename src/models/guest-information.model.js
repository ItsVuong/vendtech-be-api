const mongoose = require('mongoose');

const GuestInfoSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required."]
        },

        lastName:{
            type: String,
            required: [true, "Last name is required."]
        },

        email:{
            type: String,
            required: false
        },

        phoneNumber:{
            type: String,
            required: false
        },
        
        message: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const GuestInfoModel = mongoose.model("GuestInfo", GuestInfoSchema);

module.exports = GuestInfoModel;