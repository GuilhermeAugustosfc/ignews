import { GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../componentes/SubscribeButton";
import styles from "./home.module.scss";
import { stripe } from "../services/stripe";
interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Gets access to all publcation <br />
            <span>for {product.amount}</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1KtP7VIyqqwvZEUd9Hh8PFqr", {
    expand: ["product"],
  });

  return {
    props: {
      product: {
        priceId: price.id,
        amount: Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price.unit_amount / 100),
      },
    },
  };
};
