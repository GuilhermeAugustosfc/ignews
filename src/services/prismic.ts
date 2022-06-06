import * as Prismic from "@prismicio/client";

export function getPrismicClient() {
  const prismic = Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRIMISC_ACCESS_TOKEN,
  });

  return prismic;
}
