const Ably = require('ably');

const ably = new Ably.Realtime.Promise(process.env.ABLY_API_KEY);
connectToAbly(ably);

async function connectToAbly(ably) {
    await ably.connection.once('connected');
    console.log('Connected to Ably!');
}


// await channel.subscribe('greeting', (message) => {
//   console.log('Received a greeting message in realtime: ' + message.data)
// });

module.exports = ably