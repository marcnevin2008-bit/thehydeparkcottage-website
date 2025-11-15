import { Helmet } from "react-helmet-async";

export function FAQHelmet() {
  const title = "FAQ | The Hyde Park Cottage – Policies, Check-In & Stay Details";
  const description =
    "Find answers to common questions about The Hyde Park Cottage in Hyde Park, NY, including check-in and check-out times, house rules, parking, Wi-Fi, pets, cancellations, and how to book your stay in the Hudson Valley.";
  const url = "https://www.thehydeparkcottage.com/faq";
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
        content="Guest information and FAQs for The Hyde Park Cottage in Hyde Park, NY"
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