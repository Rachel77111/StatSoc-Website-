
import type { RouteObject } from 'react-router';

import HomePage from './pages/index';
import EventsPage from './pages/events';
import PastEventPage from './pages/past-event';
import OpportunitiesPage from './pages/opportunities';
import MembershipPage from './pages/membership';
import NewsletterPage from './pages/newsletter';
import NotFoundPage from './pages/_404';
import FunPage from './pages/fun';
import AdminEditorRedirect from './pages/admin/editor';
import TeamPage from './pages/team';

export const routes: RouteObject[] = [
  {
    path: '/team',
    element: <TeamPage />,
  },
  {
    path: '/admin',
    element: <AdminEditorRedirect />,
  },
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/events',
    element: <EventsPage />,
  },
  {
    path: '/events/past/:slug',
    element: <PastEventPage />,
  },
  {
    path: '/opportunities',
    element: <OpportunitiesPage />,
  },
  {
    path: '/fun',
    element: <FunPage />,
  },
  {
    path: '/membership',
    element: <MembershipPage />,
  },
  {
    path: '/newsletter',
    element: <NewsletterPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export type Path =
  | '/team'
  | '/'
  | '/events'
  | '/opportunities'
  | '/fun'
  | '/membership'
  | '/newsletter';

export type Params = Record<string, string | undefined>;
