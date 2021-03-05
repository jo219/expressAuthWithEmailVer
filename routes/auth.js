const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { registerValidation, loginValidation } = require('../validation');
const mailer = require('./mailer');


router.post('/register', async (req, res) => {
	const { error } = registerValidation(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	const emailExist = await User.findOne({email: req.body.email});
	if(emailExist) return res.status(400).send('Email ' + emailExist.email + ' already exist');

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	const activeToken = await bcrypt.genSalt(20);
    const link = 'http://localhost:3000/api/user/active/' + activeToken;
    try {
		mailer({
	        to: req.body.email,
	        subject: 'Welcome',
	        html: 'Please click <a href="' + link + '"> here </a> to activate your account.'
		});
	} catch(err) {
		return res.status(400).send(err);
	}

	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
		activeToken: activeToken,
		activeExpires: Date.now() + 24 * 3600 * 1000,
	});
	try {
		const savedUser = await user.save();
	    res.send('The activation email for new id:' + savedUser._id + ' has been sent to ' + savedUser.email + ', please click the activation link within 24 hours.');
	} catch(err) {
		res.status(400).send(err);
	}
});

router.post('/login', async (req, res) => {
	const { error } = loginValidation(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	const user = await User.findOne({email: req.body.email});
	if(!user) return res.status(400).send('Email or password is wrong');

	const validPass = await bcrypt.compare(req.body.password, user.password);
	if(!validPass) return res.status(400).send('Invalid password');

	const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
	res.header('auth-token', token).send(token);
});

router.get('/active/:activeToken', async (req, res) => {
    const user = await User.findOne({activeToken: req.params.activeToken, activeExpires: {$gt: Date.now()} });
    if(!user) return res.status(400).send('Your activation link is invalid, please <a href="/api/auth/register">register</a> again');

    user.active = true;
    try {
		const savedUser = await user.save();
	    res.send('Account with email:' + savedUser.email + ' has been activated.');
	} catch(err) {
		res.status(400).send(err);
	}
});

module.exports = router;