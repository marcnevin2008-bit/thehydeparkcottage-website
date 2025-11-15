import { Helmet } from "react-helmet-async";

export function RoomsHelmet() {
  const title = "Rooms & Sleeping Arrangements | The Hyde Park Cottage";
  const description =
    "Explore the rooms at The Hyde Park Cottage in Hyde Park, NY. Comfortable bedrooms, quality mattresses, fresh linens, and flexible sleeping arrangements for families, couples, and small groups visiting the Hudson Valley.";
  const url = "https://www.thehydeparkcottage.com/rooms";
  const image = "https://www.thehydeparkcottage.com/og/the-hyde-park-cottage-og.jpg";

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="The Hyde Park Cottage" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta
        property="og:image:alt"
        content="Cozy bedroom at The Hyde Park Cottage vacation rental in Hyde Park, NY"
      />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta name="robots" content="index,follow" />
    </Helmet>
  );
}