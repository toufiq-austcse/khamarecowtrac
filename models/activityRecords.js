const mongoose = require('mongoose');

let activityRecordsSchema = new mongoose.Schema({

    cattle_id:{
        type: String
    },
    x_value:{
        type:String
    },
    y_value:{
        type:String
    },
    z_value:{
        type:String
    },
    temp_value:{
        type:String
    }
},{
    timestamps: true
});

const activity_records =  mongoose.model("activity_records",activityRecordsSchema);
module.exports = activity_records;
