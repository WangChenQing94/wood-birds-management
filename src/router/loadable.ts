import Loabable from 'react-loadable';

export const loadable = (viewPath: string) => Loabable({
  loader: () => import(`../views/${viewPath}`),
  loading: () => (null)
})