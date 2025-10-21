import { PropsWithChildren } from 'react';
import { Link } from 'react-router';

interface NavItem {
  label: string;
  href: string;
}

const Title = () => (
  <div className="col-span-2 col-start-3">
    <Link to="/" className="font-pinyon text-7xl">
      Grandma's Chandelier
    </Link>
  </div>
);

const navItems: NavItem[] = [
  {
    label: 'Band',
    href: '/band',
  },
  {
    label: 'Merch',
    href: '/merch',
  },
  {
    label: 'Music',
    href: '/music',
  },
];

const Navigation = () => (
  <div className="col-start-1 col-end-7">
    <div className="grid grid-cols-3">
      {navItems.map((item) => (
        <div className="mx-1 border border-amber-600 rounded-md">
          <Link className="px-2 py-1" to={item.href}>
            {item.label}
          </Link>
        </div>
      ))}
    </div>
  </div>
);

const Header = () => {
  return (
    <div className="grid grid-cols-6 justify-items-center mt-15">
      <Title />
      <Navigation />
    </div>
  );
};

export const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};
