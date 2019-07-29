require('dotenv').config();
const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Message = require('../models/Message');

const client = require('twilio')(process.env.accountSid, process.env.authToken);

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	}

	function showPosition(position) {
		location = position.coords.latitude + ', ' + position.coords.longtitude;
		console.log(location);
	}
	return location;
} 

module.exports = Router() 

	.post('/send', (req, res, next) => {
		const {
			fullname,
			from,
			body,
			location,
			to
		} = req.body;

		Message
			.create({
				fullname,
				from,
				body,
				location,
				to,
			})
			.then(message => {
				console.log(message)
				const {
					body,
					from,
					to
				} = message;

				client.messages
					.create({
					body,
					from,
					to
					})
			})
			.catch(next);

	})
	// .get('/location', (req, res, next) => {
	// 	res.send('hi')
	// 	getLocation();
	// })
	
	