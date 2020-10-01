import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import { assign } from 'lodash';
import feathersVuex from 'feathers-vuex';

const locations = {
  development: 'http://localhost:3030',
  production: process.env.VUE_APP_API_DOMAIN,
};
const apiDomain = locations[process.env.VUE_APP_NODE_ENV];
const socket = io(apiDomain);

const feathersClient = feathers()
  .configure(socketio(socket, { timeout: 20000 }))
  .configure(auth({ storage: window.localStorage }));

const {
  makeServicePlugin, BaseModel, makeAuthPlugin, FeathersVuex,
} = feathersVuex(feathersClient, { idField: '_id', customMerge: assign });

export {
  makeServicePlugin, BaseModel, makeAuthPlugin, FeathersVuex,
};
export default feathersClient;
