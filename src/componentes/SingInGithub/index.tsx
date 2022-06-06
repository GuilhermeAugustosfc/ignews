import styles from "./styles.module.scss";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";

export function SingInGithub() {
  const session = useSession();
  let color = session.data ? "#0fd381" : "#eba417";
  return session.data ? (
    <button type="button" className={styles.singInGithub}>
      <FaGithub color={color} />
      Guilherme
      <FiX
        color="#737380"
        className={styles.closeIcon}
        onClick={() => signOut()}
      />
    </button>
  ) : (
    <button
      type="button"
      className={styles.singInGithub}
      onClick={() => signIn("github")}
    >
      <FaGithub color={color} />
      Sing in with Github
    </button>
  );
}
