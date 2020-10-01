import feathersClient, {
    makeServicePlugin,
    BaseModel,
} from '../../feathers-client';

class Groups extends BaseModel {
    // Required for $FeathersVuex plugin to work after production transpile.
    static modelName = 'Groups';
}
const servicePath = 'groups';
const servicePlugin = makeServicePlugin({
    Model: Groups,
    service: feathersClient.service(servicePath),
    servicePath,
    paginate: true,
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
