'use client';
import { Configure, InstantSearch } from "react-instantsearch";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { MEILISEARCH_KEY, MEILISEARCH_URL } from "../services/axiosInstance";



export const InstantWrapper = (props: any) => {


  const searchClient: any = instantMeiliSearch(MEILISEARCH_URL, 
    MEILISEARCH_KEY,
    {
    finitePagination: true,
    primaryKey: "id",
    placeholderSearch: true,
    keepZeroFacets: false,
    // Enable stats for numeric attributes to support range facets
    // Use the correct structure for MeiliSearch configuration
    meiliSearchParams: {
      attributesToHighlight: ['*'],
      attributesToRetrieve: ['*'],
      attributesToCrop: ['*'],
    }
  }).searchClient;


  // Build filters
  let slug = "";
  if (props.slug) {
    slug += " AND slug:" + props.slug;
  }
  if (props.make) {
    const formatted = props.make.replace(/%20/g, " ");
    slug += " AND make:" + formatted;
  }
  if (props.model) {
    const formatted = props.model.replace(/%20/g, " ");
    slug += " AND model:" + formatted;
  }


  let index: any = null;
  index =  props.searchIndex || "cars";


  // Get limit from props or use default value
  const hitsPerPage = props.limit || 9;

  return  <InstantSearch
    routing={true}
    searchClient={searchClient}
    indexName={index}
    future={{ preserveSharedStateOnUnmount: false }}
  >
    <Configure
      attributesToRetrieve={["*"]}
      filters={slug}
      hitsPerPage={hitsPerPage}
      facets={["*", "sellingPrice"]}
    />
    {props.children}
  </InstantSearch>

};

