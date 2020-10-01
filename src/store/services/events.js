import feathersClient, {
    makeServicePlugin,
    BaseModel,
} from '../../feathers-client';

class Events extends BaseModel {
    // Required for $FeathersVuex plugin to work after production transpile.
    static modelName = 'Events';
}
const servicePath = 'events';
const servicePlugin = makeServicePlugin({
    Model: Events,
    service: feathersClient.service(servicePath),
    servicePath,
});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
    before: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
});

export default servicePlugin;
