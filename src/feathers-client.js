import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import io from 'socket.io-client';

const locations = {
  development: 'http://localhost:3030',
  production: 'https://api.myacc.es',
};

const socket = io(locations[process.env.NODE_ENV], { transports: ['websocket'] });

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }));

export default feathersClient;
