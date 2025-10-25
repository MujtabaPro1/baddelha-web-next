'use client';
import { Configure, InstantSearch } from "react-instantsearch";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";



export const InstantWrapper = (props: any) => {

  //http://ec2-15-184-133-49.me-south-1.compute.amazonaws.com:7700/indexes/cars/search
  //http://127.0.0.1 baddelha
  const searchClient: any = instantMeiliSearch('ec2-15-184-133-49.me-south-1.compute.amazonaws.com:7700', 'cQ1LoLfnMm5rmdHhHXX3_piDBOU3LZb5Dwa_C_PmzCg', {
    finitePagination: true,
    primaryKey: "id",
    placeholderSearch: true,
    keepZeroFacets: false,
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
  index =  "cars";


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
    />
    {props.children}
  </InstantSearch>

};

