import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";

import styles from "../postDetail.module.scss";

interface PostProps {
  slug: string;
  title: string;
  content: string;
  updateAt: string;
}

interface PreviewProps {
  post: PostProps;
}

export default function Preview({ post }: PreviewProps) {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.data?.activeUserSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updateAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue Reading ?
            <Link href={"/"}>
              <a>Subscribe now 🤓</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = await getPrismicClient();
  const postSlug = await prismic.getByUID("publication", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(postSlug.data.title),
    content: RichText.asHtml(postSlug.data.content.splice(0, 3)),
    updateAt: new Date(postSlug.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };
  return {
    props: {
      post,
    },
  };
};
