require('dotenv').config();
const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Message = require('../models/Message');

const client = require('twilio')(process.env.accountSid, process.env.authToken);

// function getLocation() {
// 	if (navigator.geolocation) {
// 		navigator.geolocation.getCurrentPosition(showPosition);
// 	}

// 	function showPosition(position) {
// 		location = position.coords.latitude + ', ' + position.coords.longtitude;
// 		console.log(location);
// 	}
// 	return location;
// } 

module.exports = Router() 

	.post('/send', ensureAuth, (req, res, next) => {
		const {
			from,
			body,
			location,
			to
		} = req.body;

		Message
			.create({
				fullname: req.user._id,
				from,
				body,
				location,
				to,
			})
			.then(message => {
				const {
					body,
					from,
					to
				} = message;
				console.log('message file', message)
				res.send(message)

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
	
	