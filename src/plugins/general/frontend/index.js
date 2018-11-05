
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
      icon: 'build',
      visiblePerms: [
        '{groupId}.group.update',
      ],
    },
    joinGroup: {
      name: 'Join Group',
      component: joinGroup,
      path: '/group/{groupId}/join',
      entry: true,
      modal: true,
      icon: 'input',
      ifEnrolledIs: false,
      onlyGroupOfTypes: ['public'],
    },
    leaveGroup: {
      name: 'Leave Group',
      component: leaveGroup,
      path: '/group/{groupId}/leave',
      entry: true,
      modal: true,
      icon: 'meeting_room',
      ifEnrolledIs: true,
      onlyGroupOfTypes: ['public'],
    },
  },
  global: true,
};
