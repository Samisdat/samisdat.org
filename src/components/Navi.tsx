import { styled } from "@linaria/react";
import Link from "next/link";
import { FC, HTMLAttributes } from "react";

const NaviStyling = styled.div`
  background: red;
`;

export const Navi: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => (
  <NaviStyling>
    <header>
      <Link href="/">samisdat.org</Link>

      <nav id="main-navigation" aria-label="Hauptnavigation">
        <ul>
          <li>
            <a href="/leistungen">Leistungen</a>
          </li>
          <li>
            <a href="/projekte">Projekte</a>
          </li>
          <li>
            <a href="/ueber-uns">Über uns</a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
          <li>
            <a href="/kontakt">Kontakt</a>
          </li>
        </ul>
      </nav>
    </header>
  </NaviStyling>
);
