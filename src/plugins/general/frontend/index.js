
import manageGroup from './manageGroup.vue';
import leaveGroup from './leaveGroup.vue';
import joinGroup from './joinGroup.vue';

export default {
  ref: 'general',
  name: 'General',
  routes: {
    manageGroup: {
      name: 'Manage Group',
      component: manageGroup,
      path: '/group/{groupId}/manageGroup',
      entry: true,
      modal: true,
      icon: 'fal fa-wrench',
      priority: 10,
      visiblePerms: [
        '{groupId}.group.write',
      ],
    },
    joinGroup: {
      name: 'Join Group',
      component: joinGroup,
      path: '/group/{groupId}/join',
      entry: true,
      modal: true,
      icon: 'fal fa-sign-in',
      priority: 1000,
      ifEnrolledIs: false,
      onlyGroupOfTypes: ['public'],
    },
    leaveGroup: {
      name: 'Leave Group',
      component: leaveGroup,
      path: '/group/{groupId}/leave',
      entry: true,
      modal: true,
      icon: 'fal fa-sign-out',
      priority: 11,
      ifEnrolledIs: true,
      onlyGroupOfTypes: ['public'],
    },
  },
  global: true,
  perms: groupId => [
    { text: 'Group - Override All Permissions', value: `${groupId}.*`, defaultRoles: ['admin'] },
    { text: 'Group - Manage Group', value: `${groupId}.group.write`, defaultRoles: ['admin'] },
    { text: 'Group - Joined', value: `${groupId}.enrolled`, defaultRoles: [] },
    { text: 'Users & Perms - View', value: `${groupId}.users.read`, defaultRoles: ['admin'] },
    { text: 'Users & Perms - Edit', value: `${groupId}.users.write`, defaultRoles: ['admin'] },
  ],
};
