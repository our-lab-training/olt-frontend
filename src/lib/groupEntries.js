import { find, filter, map, orderBy } from 'lodash';

function loadPluginEntries(group, isEnrolled, options) {
  const plugs = [
    ...filter(this.$plugins, plugin => options.globalPlugins && plugin.global),
    ...filter(this.$plugins, p => !!find(group.plugins || [], r => r === p.ref)),
  ];
  const ents = [];
  map(plugs, (plugin) => {
    map(plugin.entries, (entry, ref) => {
      if ((
        entry.onlyGroupOfTypes &&
        entry.onlyGroupOfTypes.indexOf(group.type) === -1
      ) ||
      (
        typeof entry.ifEnrolledIs === 'boolean' &&
        entry.ifEnrolledIs !== isEnrolled
      ) ||
      (
        entry.visiblePerms &&
        !find(entry.visiblePerms, perm => this.hasPerm(perm.replace('{groupId}', group._id)))
      ) ||
      (
        entry.invisiblePerms &&
        find(entry.invisiblePerms, perm => this.hasPerm(perm.replace('{groupId}', group._id)))
      )) return;
      ents.push({
        ...entry,
        ref,
        plugin,
        priority: entry.priority || 100,
      });
    });
  });
  return orderBy(ents, ['priority', 'name'], ['desc', 'asc']);
}

export default function init(opts = {}) {
  const options = Object.assign({ globalPlugins: true }, opts);
  return function groupEntries() {
    const { user } = this.$store.state.auth;
    return this.groups.reduce((a, group) => {
      const isEnrolled = user.perms.groups.indexOf(group._id) !== -1;
      a[group._id] = [];
      if (isEnrolled || ['template', 'public'].indexOf(group.type) !== -1) {
        a[group._id] = loadPluginEntries.call(this, group, isEnrolled, options);
      }
      return a;
    }, {});
  };
}
