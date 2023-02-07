const Ably = require('ably');

const ably = new Ably.Realtime.Promise('PEc6bw.-PeguQ:J46g6vuY1Qg0w28m2GCqC3x65kZQRe4BBj5ik2D4lC0');
connectToAbly(ably);

async function connectToAbly(ably) {
    await ably.connection.once('connected');
    console.log('Connected to Ably!');
}


// await channel.subscribe('greeting', (message) => {
//   console.log('Received a greeting message in realtime: ' + message.data)
// });

module.exports = ably