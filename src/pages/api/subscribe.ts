import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import driveFauna from "faunadb";
import { stripe } from "../../services/stripe";
type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_id_custumer: string;
  };
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Allow");
  }

  const session = await getSession({
    req: req,
  });

  // GET USER FAUNADB
  const userFauna = await fauna.query<User>(
    driveFauna.Get(
      driveFauna.Match(
        driveFauna.Index("user_by_email"),
        driveFauna.Casefold(session.user.email)
      )
    )
  );

  let custumerId = userFauna.data.stripe_id_custumer;

  if (!custumerId) {
    // CASO NAO EXITIR NO USER O ID DO STRIPE, ATUALIZAR USER COM ID STRIPE
    const stripeCustumer = await stripe.customers.create({
      email: session.user.email,
    });

    await fauna.query(
      driveFauna.Update(
        driveFauna.Ref(driveFauna.Collection("users"), userFauna.ref.id),
        {
          data: {
            stripe_id_custumer: stripeCustumer.id,
          },
        }
      )
    );

    custumerId = stripeCustumer.id;
  }

  // CRIANDO CONFIG DO PAGAMENTO PARA APARECER NA PAGINA QUE SERA REDIRECIONADA NO STRIPE

  const stripeCheckout = await stripe.checkout.sessions.create({
    cancel_url: process.env.STRIPE_CANCEL_URL,
    success_url: process.env.STRIPE_SUCCESS_URL,
    allow_promotion_codes: true,
    billing_address_collection: "required",
    customer: custumerId,
    line_items: [
      {
        price: "price_1KtP7VIyqqwvZEUd9Hh8PFqr",
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],
    mode: "subscription",
  });

  res.status(200).json({ sessionId: stripeCheckout.id });
};
