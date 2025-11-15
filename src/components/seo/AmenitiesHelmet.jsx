import { Helmet } from "react-helmet-async";

export function AmenitiesHelmet() {
  const title = "Amenities | The Hyde Park Cottage – Hudson Valley Getaway";
  const description =
    "Discover the amenities at The Hyde Park Cottage in Hyde Park, NY: fully equipped kitchen, cozy living room, fast Wi-Fi, smart TVs, wood-burning fireplace, dedicated workspaces, and a spacious backyard with patio and grill.";
  const url = "https://www.thehydeparkcottage.com/amenities";
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
        content="Inviting living space and amenities at The Hyde Park Cottage in Hyde Park, NY"
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
