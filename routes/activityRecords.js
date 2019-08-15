const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const ActivityRecords = require('../models/activityRecords');
const timeUtils = require('../utils/time');

const STARTTIMEINSECOND= new Date().getTime()/1000;
router.post("/cowtrac/postactivity",async (req,res)=>{
    const currentDate = new Date();
    const currentTimeInSeconds = timeUtils.convertTimeToSeconds(currentDate.getHours(),currentDate.getMinutes(),currentDate.getSeconds());
    console.log(currentTimeInSeconds);
    try{
        let activityRecord = await ActivityRecords.find({}).sort({_id: -1}).limit(1);

        if(activityRecord.length === 1){
            let createdDate = new Date(activityRecord[0].createdAt);
            let createdTimeInSeconds = timeUtils.convertTimeToSeconds(createdDate.getHours(),createdDate.getMinutes(),createdDate.getSeconds());
            let timeInSecondsDiff =currentTimeInSeconds-createdTimeInSeconds;

            if( timeInSecondsDiff< 3600){
                let allCurrentRecords = activityRecord[0].records;
                let updateIndex = allCurrentRecords.indexOf(timeInSecondsDiff);

                if(updateIndex === -1){
                    allCurrentRecords.push({
                        second:timeInSecondsDiff,
                        data:{
                            cattle_id:req.query.cattle_id,
                            x_value:req.query.x_value,
                            y_value:req.query.y_value,
                            z_value:req.query.z_value,
                            temp_value:req.query.temp_value
                        }
                    })
                }
                else{
                    allCurrentRecords[updateIndex].data = allCurrentRecords[updateIndex].data.concat({
                        cattle_id:req.query.cattle_id,
                        x_value:req.query.x_value,
                        y_value:req.query.y_value,
                        z_value:req.query.z_value,
                        temp_value:req.query.temp_value
                    });
                }


                await activityRecord[0].save();
                res.status(200).json({message:"updated"});
            }else{
                let aNewActivityRecord = new ActivityRecords({
                    records: [{
                        second:0,
                        data:[{
                            cattle_id:req.query.cattle_id,
                            x_value:req.query.x_value,
                            y_value:req.query.y_value,
                            z_value:req.query.z_value,
                            temp_value:req.query.temp_value
                        }]
                    }]
                });

                await aNewActivityRecord.save();
                res.status(201).json({message:"Created 1"});
            }

        }else{
            let aNewActivityRecord = new ActivityRecords({
                records: [{
                    second:0,
                    data:[{
                        cattle_id:req.query.cattle_id,
                        x_value:req.query.x_value,
                        y_value:req.query.y_value,
                        z_value:req.query.z_value,
                        temp_value:req.query.temp_value
                    }]
                }]
            });

            await aNewActivityRecord.save();
            res.status(201).json({message:"Created 2"});
        }
    }catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }



});

module.exports = router;

