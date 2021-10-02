import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link'

interface UserProps {
  currentUser: {
    id: string;
    email: string;
  }
}

const Header: NextPage<UserProps> = ({ currentUser }) => {
  const LINKS = [
    !currentUser && { label: "Sign In", href: "/auth/signin"},
    !currentUser && { label: "Sign Up", href: "/auth/signup"},
    currentUser && { label: "Sign Out", href: "/auth/signout"}
  ].filter(linkConfig => linkConfig)
  .map(({ label, href}) => {
    return (
      <Link key={href} href={href}>
        <a className="header_label">{label}</a>
      </Link>
    );
  })

  return (
    <div className="header_container">
    {LINKS}
    </div>
  );

}

export { Header };
