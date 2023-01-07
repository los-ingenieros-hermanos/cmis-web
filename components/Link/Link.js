import NextLink from 'next/link';

export default function Link({ href, children, className, replace, target }) {
  return (
    <NextLink href={href} replace={replace} target={target}>
      <a className={className}>{children}</a>
    </NextLink>
  );
}
