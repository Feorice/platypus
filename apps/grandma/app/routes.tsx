import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('./app.tsx'),
  // route('about', './routes/about.tsx'),
  route('band', './routes/band.tsx'),
  route('merch', './routes/merch.tsx'),
  route('music', './routes/music.tsx'),
] satisfies RouteConfig;
