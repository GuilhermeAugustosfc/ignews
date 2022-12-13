import styles from "./styles.module.scss";
import Head from "next/head";
import { GetStaticProps } from "next";
import { getPrismicClient } from "../../services/prismic";

import { RichText } from "prismic-dom";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface PostProp {
  slug: string;
  title: string;
  excerpt: string;
  updateAt: string;
}
interface PostsProps {
  posts: PostProp[];
}

export default function Posts({ posts }: PostsProps) {
  const session = useSession();
  const linkPostValid = session.data ? "posts" : "posts/preview";
  return (
    <>
      <Head>
        <title>Ignews | Posts</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link
              href={{
                pathname: `${linkPostValid}/${post.slug}`,
              }}
              key={post.slug}
            >
              <a>
                <time>{post.updateAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.getAllByType("publication", {
    fetch: ["publication.title", "publication.content"],
    pageSize: 100,
  });

  const posts = response.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find((content) => content.type === "paragraph")
          ?.text ?? "",
      updateAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: {
      posts,
    },
  };
};
