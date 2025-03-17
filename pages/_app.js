import Head from 'next/head';
import '../styles/global.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>RapScout</title>
                <link rel="shortcut icon" href="/assets/favicon.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="RapScout - Track and analyze collectibles on Hexagon!" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
