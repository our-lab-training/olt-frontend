import feathersClient, {
    makeServicePlugin,
    BaseModel,
} from '../../feathers-client';

class NotifyTemplates extends BaseModel {
    // Required for $FeathersVuex plugin to work after production transpile.
    static modelName = 'NotifyTemplates';
}
const servicePath = 'notify-templates';
const servicePlugin = makeServicePlugin({
    Model: NotifyTemplates,
    service: feathersClient.service(servicePath),
    servicePath,
    instanceDefaults: {
        groupId: '',
        subject: '',
        text: '',
        short: '',
        to: '',
        cc: '',
        bcc: '',
        sendToUsers: true,
        groupUsers: false,
        sendOn: 'instant',
        sendOnHour: 8,
        sendOnDay: [],
    },
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
