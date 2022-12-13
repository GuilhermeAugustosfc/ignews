import { ActiveLink } from "../ActiveLink";
import { SingInGithub } from "../SingInGithub";
import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink href="/" classActive={styles.active}>
            <a>Home</a>
          </ActiveLink>

          <ActiveLink href="/posts" classActive={styles.active}>
            <a>Post</a>
          </ActiveLink>
        </nav>

        <SingInGithub />
      </div>
    </header>
  );
}
