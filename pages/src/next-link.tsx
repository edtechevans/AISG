import type { ComponentPropsWithoutRef } from 'react';

type StaticLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  href: string | { pathname?: string };
};

export default function StaticLink({ href, children, ...props }: StaticLinkProps) {
  const path = typeof href === 'string' ? href : href.pathname || '/';
  const basePath = new URL('.', window.location.href).pathname;
  const resolved = path.startsWith('/')
    ? `${basePath}${path.slice(1)}`
    : path;

  return <a href={resolved} {...props}>{children}</a>;
}
