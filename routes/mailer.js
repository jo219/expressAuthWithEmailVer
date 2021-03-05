const _ = require('lodash');
const nodemailer = require('nodemailer');

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

module.exports = async mail => {
	mail = _.merge({}, defaultMail, mail);

	transporter.sendMail(mail, (error, info) => {
		if(error) return console.log(error);
		console.log('mail sent: ', info.response);
	});
};