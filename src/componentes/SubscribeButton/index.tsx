import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const session = useSession();
  const router = useRouter();
  const hundleSubscribe = async () => {
    if (!session.data) {
      signOut();
      return;
    }
    console.log(session);

    if (session.data && session.data.hasOwnProperty("activeUserSubscription")) {
      router.push("/posts");
      return;
    }

    try {
      const response = await api.post<{ sessionId: string }>("/subscribe");
      const { sessionId } = response.data;
      const stripejs = await getStripeJs();
      await stripejs.redirectToCheckout({
        sessionId,
      });
    } catch (error) {
      alert(error);
    }
  };
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={hundleSubscribe}
    >
      Subscribe Now
    </button>
  );
}
