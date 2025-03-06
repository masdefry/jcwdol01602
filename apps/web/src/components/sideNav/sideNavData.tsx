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

export { DevSideNav, UserSideNav };
