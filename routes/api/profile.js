const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');
const request  = require('request');
const config  = require('config');

router.get('/me', auth, async (req, res) => {
    try{
        const profile = await Profile.findOne({ user: req.user.id }).populate
        ('user', ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({ msg: "Tidak ada profile untuk user ini" })
        }

        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//create or update data profile
// validasi express
router.post('/', [auth,[
    check('status','Status is required')
        .not()
        .isEmpty(),
    check('skills','Skill is required')
        .not()
        .isEmpty(),
]
], async (req, res) => {
    const  errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    const{
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //buat profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    // console.log(profileFields.skills);
    // res.send(profileFields.skills);

    //buat social object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try{
        let profile = await Profile.findOne({ user: req.user.id });

        if(profile){
            //update profile
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true}
            );

            return res.json(profile);
        }

        //create profile
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
    }

});


//get all profiles by id user
router.get('/', async(req,res) => {
    try{
        const profiles = await Profile.find()
            .populate('user',['name', 'avatar']);
            res.json(profiles);
    }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
    }
});

//single profile by id user
router.get('/user/:user_id', async(req, res) => {
    try{
        const profile = await Profile.find({ user: req.params.user_id })
        .populate('user', ['name','avatar']);

        if(!profile) return res.status(400).json({msg: "Profile tidak ditemukan"});

        res.json(profile);

    }catch(err){
        // console.err(err.message);

        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile tidak ada' });
        }
        res.status(500).send('server error');
    }
});


// delete profile, user and post
router.delete('/', auth, async(req, res) => {
    try{
        // remove profile
        const removeprofile =  await Profile.findOneAndRemove({ user: req.user.id });
        // console.log(removeprofile);

        // remove user
        const removeuser = await Profile.findOneAndRemove({ _id: req.user.id });
        // console.log(removeuser);

        res.json({ msg: "User berhasil dihapus" });
    }catch(err){
        console.err(err.message);
        res.status(500).send('server error');
    }
});

// add profile user experience
router.put('/experience', [auth, [
   check('title', 'Title is required')
   .not()
   .isEmpty(),
   check('company', 'Company is required')
   .not()
   .isEmpty(),
   check('from', 'From is required')
   .not()
   .isEmpty(), 
]], async (req, res) => {
    //  jika di validasinya ada error
    const  errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }
    // apabila tidak error
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    // buat variable
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    // try and catch
    try{
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }
});

// delete profile experience
router.delete('/experience/:exp_id', auth, async(req, res) => {
    try {
    const profile = await Profile.findOne({ user: req.user.id });
    // get remove index experience
    const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
    }
});

// add profile user education
router.put('/education', [auth, [
    check('school', 'School is required')
    .not()
    .isEmpty(),
    check('degree', 'Degree is required')
    .not()
    .isEmpty(),
    check('fieldofstudy', 'Fieldofstudy')
    .not()
    .isEmpty(),
    check('from', 'from')
    .not()
    .isEmpty(),
]], async(req, res) => {
    //jika ada error
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });

    }

    //apabila tidak error
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        description
    } = req.body;

    // buat variable utk simpan data
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        description
    }

    //try and catch
    try{
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }
});

//delete profile education
router.delete('/education/:edu_id', auth,  async(req,res) => {
    try{
        const profile = await Profile.findOne({ user: req.user.id });
        //get remove index education
        const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);
        
        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
        
    }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
    }
});

//get github profile
router.get('/github/:username', (req, res) => {
    try{
        const option = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')} client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        }

        request(option, (error, response, body) => {
            if(error) console.error(error);

            if(response.statusCode !== 200){
                return res.status(404).json({ msg: "no github profile found" })
            }

            res.json(JSON.parse(body));
        });

    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});

//export route
module.exports = router;