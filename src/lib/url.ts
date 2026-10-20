// Build a link that works at the domain root and under a base path (GitHub Pages: /<slug>/).
const root = import.meta.env.BASE_URL.replace(/\/$/, '');
export const href = (path: string) => `${root}/${path.replace(/^\//, '')}`;
// Remove the base path from a pathname, so "/slug/about/" becomes "/about/".
export const unbase = (pathname: string) => (root && pathname.startsWith(root) ? pathname.slice(root.length) || '/' : pathname);
