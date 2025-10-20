'use client';
import { Configure, InstantSearch } from "react-instantsearch";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";



export const InstantWrapper = (props: any) => {

  const searchClient = instantMeiliSearch('127.0.0.1:7700', 'baddelha', {
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

