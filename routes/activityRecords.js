const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const ActivityRecords = require('../models/activityRecords');
const timeUtils = require('../utils/time');

const STARTTIMEINSECOND= new Date().getTime()/1000;
router.post("/cowtrac/postactivity",async (req,res)=>{


    const filter = {
        // 'records.data.cattle_id':{
        //     $eq:"1"
        // }
        createdAt:{$gt:new Date(Date.now() - 1*60*60 * 1000)},
        'records.time':{
            $eq:new Date('2019-08-17T20:18:27.456+00:00')
        },



    };


    const update = {
        $push:{
            'records.0.time':Date.now(),
        },
        $push:{
            'records.data':{
                cattle_id:req.query.cattle_id,
                x_value: req.query.x_value,
                y_value:req.query.y_value,
                z_value: req.query.z_value,
                temp_value:req.query.temp_value
            }


            // rec
            // records:{
            //     time: new Date() ,
            //     data:[{
            //         cattle_id:req.query.cattle_id,
            //         x_value: req.query.x_value,
            //         y_value:req.query.y_value,
            //         z_value: req.query.z_value,
            //         temp_value:req.query.temp_value
            //     }]
            // }
        }

    };

    try {
        let doc = await ActivityRecords.findOneAndUpdate(filter,update,{
            new: true,
            upsert: true // Make this update into an upsert
        });
        res.status(201).json(doc);
    }catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
    }

});

module.exports = router;

