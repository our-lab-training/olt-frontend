import feathersClient, {
    makeServicePlugin,
    BaseModel,
} from '../../feathers-client';

const node2reg = (node) => new RegExp(node.replace(/\//g, '\\/').replace(/\*/g, '.*'));

const hasPerm = (state, permission, exact = false) => {
    const { user } = state.auth;
    let perm = permission;
    if (typeof permission === 'string') perm = permission.split('.');
    return user.perms.all.some((p) => {
        if (exact && p.length !== perm.length) return false;
        for (let i = 0; i < Math.min(p.length, perm.length); i += 1) {
            if (!exact && p[i] === '*') return true;
            if (p[i] === '*' || p[i].indexOf('*') === -1 || !node2reg(p[i]).test(perm[i])) {
                if ((exact || perm[i] !== '*') && perm[i] !== p[i]) return false;
            }
        }
        return true;
    });
};

class Users extends BaseModel {
    // Required for $FeathersVuex plugin to work after production transpile.
    static modelName = 'Users';
}
const servicePath = 'users';
const servicePlugin = makeServicePlugin({
    Model: Users,
    service: feathersClient.service(servicePath),
    servicePath,
    paginate: true,
    replaceItems: true,
    getters: {
        hasPerm: (state, getters, rootState) => (perm, exact = false) => hasPerm(rootState, perm, exact),
    },
    actions: {
        hasPerm: ({ rootState }, perm) => hasPerm(rootState, perm, false),
        hasPermExact: ({ rootState }, perm) => hasPerm(rootState, perm, true),
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
