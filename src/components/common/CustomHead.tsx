// components/common/CustomHead.tsx
import Head from 'next/head';
import {FC} from 'react';
import {useRouter} from "next/router";

interface CustomHeadProps {
    title: string;
    description: string;
    pageType?: 'website' | 'article';
    ogImage?: string;
    author?: string;
}

const CustomHead: FC<CustomHeadProps> = ({
                                             title,
                                             description,
                                             pageType = 'website',
                                             ogImage = '/img/logos/ICPS-og.png',
                                             author = 'Jack Vanderpump'
                                         }) => {
    const router = useRouter();
    const siteTitle = "Electoral Stakeholders' Network";
    const fullTitle = `${title} | ${siteTitle}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://electoralnetwork.org';
    const pageUrl = `${baseUrl}${router.asPath}`;
    // white theme colour
    const themeColor = '#ffffff';

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description}/>
            <meta name="author" content={author}/>
            <link rel="canonical" href={pageUrl}/>

            {/* Open Graph */}
            <meta property="og:site_name" content={siteTitle}/>
            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>
            <meta property="og:url" content={pageUrl}/>
            <meta property="og:type" content={pageType}/>
            <meta property="og:image" content={ogImage}/>
            <meta property="og:image:alt" content={title}/>

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={title}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={ogImage}/>

            {/* Additional Meta Tags */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta charSet="utf-8"/>
            <meta name="theme-color" content={themeColor}/>

            {/* Favicon - match with Sandbox template */}
            <link rel="shortcut icon" href="/img/favicons/favicon.ico"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/img/favicons/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/img/favicons/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/img/favicons/favicon-16x16.png"/>
        </Head>
    );
};

export default CustomHead;