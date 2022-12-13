import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import driveFauna from "faunadb";
import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    // OAuth authentication providers...
    GitHubProvider({
      clientId: process.env.GITHUB_AUTH_PUBLIC_KEY,
      clientSecret: process.env.GITHUB_AUTH_SECRET_KEY,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      const email = session.user.email;

      try {
        const activeUserSubscription = await fauna.query(
          driveFauna.Get(
            driveFauna.Intersection([
              driveFauna.Match(
                driveFauna.Index("subscription_by_user_ref"),
                driveFauna.Select(
                  "ref",
                  driveFauna.Get(
                    driveFauna.Match(
                      driveFauna.Index("user_by_email"),
                      driveFauna.Casefold(email)
                    )
                  )
                )
              ),
              driveFauna.Match(
                driveFauna.Index("subscription_by_status"),
                "active"
              ),
            ])
          )
        );

        return { ...session, activeUserSubscription };
      } catch (error) {
        return { ...session, activeUserSubscription: null };
      }
    },
    async signIn({ user, account, profile, email, credentials }) {
      try {
        fauna.query(
          driveFauna.If(
            driveFauna.Not(
              driveFauna.Exists(
                driveFauna.Match(
                  driveFauna.Index("user_by_email"),
                  driveFauna.Casefold(user.email)
                )
              )
            ),
            driveFauna.Create(driveFauna.Collection("users"), {
              data: { email: user.email },
            }),
            driveFauna.Get(
              driveFauna.Match(
                driveFauna.Index("user_by_email"),
                driveFauna.Casefold(user.email)
              )
            )
          )
        );
        return true;
      } catch (error) {
        return false;
      }
    },
  },
});
