import NextLink from 'next/link';

export default function Link({ href, children, className }) {
  return (
    <NextLink href={href} passHref>
      <a className={className}>{children}</a>
    </NextLink>
  );
}
