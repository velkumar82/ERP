
const router = require('express').Router();
const Timetable = require('../models/Timetable');

router.get('/timetable/:facultyId', async (req,res)=>{
 const day = new Date().toLocaleString('en-US',{weekday:'long'});
 const data = await Timetable.find({facultyId:req.params.facultyId, day});
 res.json(data);
});

module.exports = router;
