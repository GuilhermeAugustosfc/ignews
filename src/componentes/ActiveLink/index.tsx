import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement, ReactElement } from "react";
interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  classActive: string;
}
export function ActiveLink({
  children,
  classActive,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter();
  const className = asPath === rest.href ? classActive : "";
  return (
    <Link {...rest}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
}
