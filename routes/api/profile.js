const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');


//@route get api/profile/me   @description Get current Users profile      @access Private
router.get('/me', auth, async (req, res) => {
    try {
        //Populate to get gravatar and name from user
        const profile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'Ther is no profile for this user' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route post api/profile/me   @description Create or update user Profile     @access Private
router.post('/', [auth, [
    check('status', 'status is required')
        .not()
        .isEmpty(),
    check('skills', 'Skills are required')
        .not()
        .isEmpty()

]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
    } = req.body;

    //Buid profile object
    const profileFields = {
        user: req.user.id,
        company,
        location,
        website,
        bio,
        skills: Array.isArray(skills)
            ? skills
    /*For transfering into array*/ : skills.split(',').map(skill => ' ' + skill.trim()),
        status,
        githubusername
    };

    //Buid social object
    const socialfields = { youtube, twitter, instagram, linkedin, facebook };

    /*for (const [key, value] of Object.entries(socialfields)) {
        if (value.length > 0)
            socialfields[key] = normalize(value, { forceHttps: true });
    }*/
    profileFields.social = socialfields;

    //Profile section
    try {
        // Using upsert option (creates new doc if no match is found):
        //Update
        let profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true }
        );
        //Create
        profile = new Profile(profile);
        await profile.save();
        //res.send('Profile Created');
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
//@route GET api/profile   @description Get all profiles in db    @access public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
//@route GET api/profile/user/:user_id   @description Get profile by user Id   @access public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
          }
        res.status(500).send('Server Error');
    }
});

//@route DELETE api/profile   @description Delete all profile full data    @access private

router.delete('/',auth, async (req, res) => {
    try {
        //Remove profile as well as posts
        await Profile.findOneAndRemove({user:req.user.id});
        await User.findOneAndRemove({_id:req.user.id});
        res.json({msg:'User deleted'});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required and needs to be from the past')
        .not()
        .isEmpty()
        .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
  
      foundProfile.experience = foundProfile.experience.filter(
        exp => exp._id.toString() !== req.params.exp_id
      );
  
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });


  // @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
    '/education',
    [
      auth,
      [
        check('school', 'School is required')
          .not()
          .isEmpty(),
        check('degree', 'Degree is required')
          .not()
          .isEmpty(),
        check('fieldofstudy', 'Field of study is required')
          .not()
          .isEmpty(),
        check('from', 'From date is required and needs to be from the past')
          .not()
          .isEmpty()
          .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;
  
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.education.unshift(newEdu);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
  
  // @route    DELETE api/profile/education/:edu_id
  // @desc     Delete education from profile
  // @access   Private
  
  router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
      foundProfile.education = foundProfile.education.filter(
        edu => edu._id.toString() !== req.params.edu_id
      );
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });
  
module.exports = router;