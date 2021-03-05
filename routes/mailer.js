const dotenv = require('dotenv');
const _ = require('lodash');
const nodemailer = require('nodemailer');

dotenv.config();

const config = {
	service: 'gmail',
	auth: {
		user: 'kucingjancuk@gmail.com',
		pass: process.env.EMAIL_PASS,
	}
};

const transporter = nodemailer.createTransport(config);

const defaultMail = {
	from: 'Admin of Orange <adminoforange@zoho.com>',
	text: 'test test',
};

module.exports = mail => {
	return new Promise( (resolve, reject) => {
		mail = _.merge({}, defaultMail, mail);
		transporter.sendMail(mail, (error, info) => {
			if(error) {
				console.log(error);
				reject('Server error, please try again later\nPrompt: ' + error.response);
			} else {
				console.log('mail sent: ', info.response);
				resolve();
			}
		});
	});
};