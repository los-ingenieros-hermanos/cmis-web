import NextLink from 'next/link';

export default function Link({ href, children, className }) {
  return (
    <NextLink href={href}>
      <a className={className}>{children}</a>
    </NextLink>
  );
}
