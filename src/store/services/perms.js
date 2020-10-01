import feathersClient, {
    makeServicePlugin,
    BaseModel,
} from '../../feathers-client';

class Perms extends BaseModel {
    // Required for $FeathersVuex plugin to work after production transpile.
    static modelName = 'Perms';
}
const servicePath = 'perms';
const servicePlugin = makeServicePlugin({
    Model: Perms,
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
