import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import io from 'socket.io-client';

const locations = {
  development: 'http://localhost:3030',
  production: 'https://api.ourlab.training',
};
const apiDomain = process.env.VUE_APP_API_DOMAIN || locations[process.env.NODE_ENV];

const socket = io(apiDomain);

const feathersClient = feathers()
  .configure(socketio(socket, { timeout: 20000 }))
  .configure(auth({ storage: window.localStorage }));

export default feathersClient;
