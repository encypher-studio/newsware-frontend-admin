import {NbMenuItem} from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Users',
    icon: 'person-outline',
    link: '/pages/users',
  },
  {
    title: 'Sign-in',
    icon: 'lock-outline',
    link: '/pages/sign-in',
  },
  {
    title: 'Sign out',
    icon: 'lock-outline',
    link: '/pages/sign-out',
    hidden: true,
  },
];
