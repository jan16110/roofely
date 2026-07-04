/**
 * Generate "find a pro" links for a given roof problem.
 * We can't know the user's exact address, so we point at trusted
 * directories pre-filled with a relevant search query.
 */
export interface ProLink {
  name: string;
  url: string;
  blurb: string;
}

export function proLinksFor(problemTitle: string): ProLink[] {
  const q = encodeURIComponent(`roof repair ${problemTitle}`);
  const near = encodeURIComponent(`roofing contractor for ${problemTitle} near me`);
  return [
    {
      name: "Angi",
      url: `https://www.angi.com/companylist/roofing.htm?searchTerm=${q}`,
      blurb: "Vetted local roofers with reviews & quotes",
    },
    {
      name: "Thumbtack",
      url: `https://www.thumbtack.com/k/roof-repair/near-me/`,
      blurb: "Compare pros and request fast estimates",
    },
    {
      name: "HomeAdvisor",
      url: `https://www.homeadvisor.com/c.Roofing.html`,
      blurb: "Pre-screened roofing professionals",
    },
    {
      name: "Google",
      url: `https://www.google.com/search?q=${near}`,
      blurb: "Top-rated roofers around your location",
    },
  ];
}
