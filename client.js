require('dotenv').config();
const jwt = require('jsonwebtoken');
const io = require('socket.io-client');
const { HOST, JWT_SIGNATURE_KEY } = process.env;
const socket = io(`${HOST}`);
const notificationActions = require('./lib/notification-actions');

console.log(HOST, "this if for debugging the client on notification");

// put the payload of jwt token of logged user here.
const token = ''

const payload = jwt.verify(token, JWT_SIGNATURE_KEY);
socket.on(`${notificationActions.booking}-${payload.id}`, (data) => { console.log(data) });;
socket.on(`${notificationActions.transfer}-${payload.id}`, (data) => { console.log(data) });;
socket.on(`${notificationActions.passenger}-${payload.id}`, (data) => { console.log(data) });;

// must be using the admin payload token
socket.on(`${notificationActions.user_cancel}-${payload.id}`, (data) => { console.log(data) });;

socket.on(`${notificationActions.verify_email}-${payload.id}`, (data) => {
    console.log(data)
})


