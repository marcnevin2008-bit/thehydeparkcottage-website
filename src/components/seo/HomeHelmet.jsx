import { Helmet } from "react-helmet-async";

export default function HomeHelmet() {
  const title = "The Hyde Park Cottage – Historic Hyde Park NY Airbnb";
  const description =
    "Stay at The Hyde Park Cottage, a cozy 1940s retreat in historic Hyde Park, NY—modern amenities, vintage charm, and a perfect base for exploring the Hudson Valley, CIA, FDR Library, and the Walkway Over the Hudson.";
  const url = "https://www.thehydeparkcottage.com/";
  const image = "https://www.thehydeparkcottage.com/og/the-hyde-park-cottage-og.jpg";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="The Hyde Park Cottage" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="The Hyde Park Cottage exterior" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta name="robots" content="index,follow" />
    </Helmet>
  );
}