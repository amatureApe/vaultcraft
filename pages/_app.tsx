import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Toaster } from "react-hot-toast";
// @ts-ignore
import NoSSR from 'react-no-ssr';
import Head from "next/head";
import { Provider } from "jotai";
import Page from "@/components/Page";
import { SUPPORTED_NETWORKS } from "@/lib/connectors";

const { provider, chains } = configureChains(SUPPORTED_NETWORKS, [
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: "app.pop.network",
  chains,
});

const client = createClient({
  autoConnect: false,
  provider,
  connectors,
});

const nextFont = Roboto({
  weight: ["400", "700", "900"],
  subsets: [],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>VCI - Creator Interface</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={nextFont.className}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root [data-rk] {
              --rk-radii-modal: 1rem;
            }
            [data-rk] * {
              font-family: ${nextFont.style.fontFamily} !important;
            }
          `,
          }}
        />
        <Toaster />
        <WagmiConfig client={client}>
          <RainbowKitProvider chains={chains} modalSize="compact">
            <NoSSR>
              <Provider>
                <Page>
                  <Component {...pageProps} />
                </Page>
              </Provider>
            </NoSSR>
          </RainbowKitProvider>
        </WagmiConfig>
      </main>
    </>
  );
}
