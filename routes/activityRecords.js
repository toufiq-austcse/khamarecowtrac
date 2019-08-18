const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const ActivityRecords = require('../models/activityRecords');
const timeUtils = require('../utils/time');

let queue = [];
router.post("/cowtrac/postactivity",async (req,res)=>{
   try {
       let activityDoc = new ActivityRecords({...req.query});
       await activityDoc.save();
       res.status(200).json({message:"inserted"})
   }catch (e) {
       console.log(e);
       res.status(500).send(e.message);
   }


});
router.get("/cowtrac/getactivity/:cattleid",async (req,res)=>{
    // console.log(req.params.cattleid);
        try {
            // let records = await ActivityRecords.find({
            //     'records.data.cattle_id' : {
            //         '$eq':"3"
            //     }
            //
            // });
            // res.status(200).json(records);

            let records = await ActivityRecords.find({cattle_id:req.params.cattleid});
            res.status(200).json(records);
        }catch (e) {
            console.log(e);
            res.status(500).send(e);
        }
});

router.post("/cowtrac/demo",async (req,res)=>{
   console.log(req.body);
   res.status(200).json(req.body);
});

module.exports = router;

