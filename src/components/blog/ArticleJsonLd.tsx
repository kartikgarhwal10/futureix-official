import { BlogPost } from "@/data/blogs";

interface ArticleJsonLdProps {
  post: BlogPost;
  url: string;
}

export function ArticleJsonLd({ post, url }: ArticleJsonLdProps) {
  const siteUrl = "https://futureix.in";
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: post.title,
    description: post.metaDescription,
    image: `${siteUrl}/opengraph-image`,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : new Date(post.publishedAt).toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
      worksFor: {
        "@type": "Organization",
        name: "FUTUREIX",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "FUTUREIX",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo-full-lockup.png`,
      },
    },
    keywords: [post.primaryKeyword, ...post.secondaryKeywords, ...post.tags].join(", "),
    articleSection: post.category,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.category,
        item: `${siteUrl}/blog?category=${encodeURIComponent(post.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: post.title,
        item: url,
      },
    ],
  };

  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
