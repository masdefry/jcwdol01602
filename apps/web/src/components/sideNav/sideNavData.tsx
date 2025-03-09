import { useParams, usePathname } from 'next/navigation';

export interface ISideNavItem {
  label: string;
  href: string;
  active: any;
}

const DevSideNav = (): ISideNavItem[] => {
  const pathname = usePathname();

  return [
    {
      label: 'Home',
      href: '/dev-dashboard/home',
      active: pathname === '/dev-dashboard/home',
    },
    {
      label: 'Payments',
      href: '/dev-dashboard/payments',
      active: pathname === '/dev-dashboard/payments',
    },
    {
      label: 'Skill List',
      href: '/dev-dashboard/skill-list',
      active: pathname === '/dev-dashboard/skill-list',
    },
    {
      label: 'Assesstment Results',
      href: '/dev-dashboard/assesstment-results',
      active: pathname === '/dev-dashboard/assesstment-restults',
    },
  ];
};

const UserSideNav = (): ISideNavItem[] => {
  const pathname = usePathname();

  return [
    {
      label: 'My Profile',
      href: '/user-data/profile',
      active: pathname === '/user-data/profile',
    },
    {
      label: 'My Plan',
      href: '/user-data/plan',
      active: pathname === '/user-data/plan',
    },
  ];
};

const AdminSideNav = (): ISideNavItem[] => {
  const pathname = usePathname();

  return [
    {
      label: 'Job',
      href: '/adm-dashboard/job',
      active: pathname === '/adm-dashboard/job',
    },
    {
      label: 'Pre Selection Test',
      href: '/adm-dashboard/pre-selection-test',
      active: pathname === '/dev-dashboard/pre-selection-test',
    },
    {
      label: 'Pre Selection Results',
      href: '/adm-dashboard/pre-selection-results',
      active: pathname === '/adm-dashboard/pre-selection-restults',
    },
    {
      label: 'Analytics',
      href: '/adm-dashboard/analytics',
      active: pathname === '/adm-dashboard/analytics',
    },
  ];
};


export { DevSideNav, UserSideNav, AdminSideNav };
