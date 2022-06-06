import { fauna } from "../../../services/fauna";
import driveFauna from "faunadb";
import { stripe } from "../../../services/stripe";
export async function saveSubscription(
  custumerId: string,
  subscriptionID: string,
  createAction: boolean
) {
  const userRef = await fauna.query(
    driveFauna.Select(
      "ref",
      driveFauna.Get(
        driveFauna.Match(
          driveFauna.Index("user_by_stripe_custumer_id"),
          custumerId
        )
      )
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionID);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  if (createAction) {
    fauna.query(
      driveFauna.Create(driveFauna.Collection("subscription"), {
        data: subscriptionData,
      })
    );
  } else {
    fauna.query(
      driveFauna.Replace(
        driveFauna.Select(
          "ref",
          driveFauna.Get(
            driveFauna.Match(
              driveFauna.Index("subscription_by_id"),
              subscriptionID
            )
          )
        ),
        { data: subscriptionData }
      )
    );
  }
}
