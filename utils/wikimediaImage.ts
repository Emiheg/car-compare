interface WikimediaPage {
  pageid: number;
  title: string;
  imageinfo?: {
    url: string;
    descriptionurl: string; // The link to the mandatory file description page
    extmetadata?: {
      Artist?: { value: string };      // HTML string of the photographer/creator
      LicenseShortName?: { value: string }; // e.g., "CC BY-SA 4.0" or "Public domain"
      UsageTerms?: { value: string };  // Explanatory legal text
    };
  }[];
}

interface WikimediaResponse {
  query?: {
    pages?: Record<string, WikimediaPage>;
  };
}

export interface CarImageResult {
  imageUrl: string;
  sourceUrl: string;
  artistHtml: string;
  licenseName: string;
  searchQuery: string;
}


export async function getCarImage(year: string, brand: string, model: string): Promise<CarImageResult | null> {
  const baseUrl = "https://commons.wikimedia.org/w/api.php";
  const searchQuery = `${year} ${brand} ${model} front`;
  console.log(`Searching Wikimedia for: ${searchQuery}`);

  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: searchQuery,
    gsrnamespace: "6", 
    gsrlimit: "1",      
    prop: "imageinfo",
    iiprop: "url|extmetadata",     
    format: "json",
    origin: "*",       
  });

  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: { "User-Agent": "NextJsCarFinderApp/1.0 (contact@yourdomain.com)" },
    });

    const data: WikimediaResponse = await response.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    const firstPageKey = Object.keys(pages)[0];
    const fileData = pages[firstPageKey]?.imageinfo?.[0];

    if (!fileData) return null;

    return {
      imageUrl: fileData.url,
      sourceUrl: fileData.descriptionurl,
      artistHtml: fileData.extmetadata?.Artist?.value || "Unknown Photographer",
      licenseName: fileData.extmetadata?.LicenseShortName?.value || "none",
      searchQuery: searchQuery
    };
  } catch (error) {
    console.error("Failed to fetch car image:", error);
    return null;
  }
}
