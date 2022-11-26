import NextLink from 'next/link';

export default function Link({ href, children, className, replace }) {
  return (
    <NextLink href={href} replace={replace}>
      <a className={className}>{children}</a>
    </NextLink>
  );
}
