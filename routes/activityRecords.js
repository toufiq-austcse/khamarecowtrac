const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const ActivityRecords = require('../models/activityRecords');
const timeUtils = require('../utils/time');

let queue = [];
router.post("/cowtrac/postactivity",async (req,res)=>{
    let aDate = new Date();
    queue.push({
       time:new Date(aDate.getFullYear(),aDate.getMonth(),aDate.getDate(),aDate.getHours(),aDate.getMinutes(),aDate.getSeconds()),
        cattle_id: req.query.cattle_id,
        x_value:req.query.x_value,
        y_value:req.query.y_value,
        z_value:req.query.z_value,
        temp_value:req.query.temp_value,
        res:res
    });


   while (queue.length !== 0) {

        let currentRec = queue.shift();
        const filter = {
            createdAt: {$gt: new Date(Date.now() - 1 * 60 * 60 * 1000)}
        };

        try {
            let recordsDoc = await ActivityRecords.findOne(filter);

            if (recordsDoc) {

                let index = recordsDoc.records.indexOf({time: currentRec.time})
                if (index === -1) {
                    recordsDoc.records = recordsDoc.records.concat({
                        time: currentRec.time,
                        data: [{
                            cattle_id: currentRec.cattle_id,
                            x_value: currentRec.x_value,
                            y_value: currentRec.y_value,
                            z_value: currentRec.z_value,
                            temp_value: currentRec.temp_value
                        }]
                    });
                } else {
                    recordsDoc.records[index].data = recordsDoc.records[index].data.concat({
                        cattle_id: currentRec.cattle_id,
                        x_value: currentRec.x_value,
                        y_value: currentRec.y_value,
                        z_value: currentRec.z_value,
                        temp_value: currentRec.temp_value
                    });
                }
                await recordsDoc.save();
                currentRec.res.status(200).json({message:"Inserted"});



            } else {
                let aNewRecord = new ActivityRecords({
                    records: [{
                        time: new Date(Date.now()),
                        data: [
                            {
                                cattle_id: currentRec.cattle_id,
                                x_value: currentRec.x_value,
                                y_value: currentRec.y_value,
                                z_value: currentRec.z_value,
                                temp_value: currentRec.temp_value
                            }
                        ],
                    }]
                });

                await aNewRecord.save();
                currentRec.res.status(200).json({message:"Inserted"});

            }

        } catch (e) {
            console.log(e);
            return res.status(500).send(e.message);
        }
    }



});

module.exports = router;

