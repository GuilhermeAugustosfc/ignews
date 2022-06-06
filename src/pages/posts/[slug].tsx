import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";

import styles from "./postDetail.module.scss";
interface PostProps {
  slug: string;
  title: string;
  content: string;
  updateAt: string;
}

interface PostDetailProps {
  post: PostProps;
}
export default function PostDetail({ post }: PostDetailProps) {
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
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const session = useSession(); // vamos usar isso depois para validar a inscricao
  console.log({ session });

  if (!session.data?.activeUserSubscription) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { slug } = params;

  const prismic = await getPrismicClient();
  const postSlug = await prismic.getByUID("publication", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(postSlug.data.title),
    content: RichText.asHtml(postSlug.data.content),
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
