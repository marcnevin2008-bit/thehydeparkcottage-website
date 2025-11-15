import { Helmet } from "react-helmet-async";

export function ThingsToDoHelmet() {
  const title = "Things to Do in Hyde Park & the Hudson Valley | The Hyde Park Cottage";
  const description =
    "Plan your Hudson Valley getaway with our curated guide to things to do near The Hyde Park Cottage: Culinary Institute of America, FDR Presidential Library, Vanderbilt Mansion, Walkway Over the Hudson, Rhinebeck, wineries, hikes, and more.";
  const url = "https://www.thehydeparkcottage.com/things-to-do";
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
        content="Map and photos of Hudson Valley attractions near The Hyde Park Cottage in Hyde Park, NY"
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