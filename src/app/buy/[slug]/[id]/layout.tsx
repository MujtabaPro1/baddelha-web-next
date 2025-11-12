import { Metadata } from "next";
import Page from "./page";


export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: any): Promise<Metadata> {
  // fetch data
   

  const {id} = await params;
  console.log(id);
  const data = await fetch(`https://stg-service.bddelha.com/api/1.0/car/car-details/${id}`
  ).then((res) => res.json());



  // optionally access and extend (rather than replace) parent metadata

  return {
    title: data?.car?.make + " " + data?.car?.model + " " + data?.car?.modelYear,
    description: "Buy used " + data?.car?.make + " " + data?.car?.model + " " + data?.car?.modelYear + " for SAR " + data?.car?.bookValue + " at Badelha",
    openGraph: {
      title: data?.car?.make + " " + data?.car?.model + " " + data?.car?.modelYear,
      type: "website",
      description: "Buy used " + data?.car?.make + " " + data?.car?.model + " " + data?.car?.modelYear + " for SAR " + data?.car?.bookValue + " at Badelha",
      images: [data?.carImages?.[0]],
      url: "https://baddelha.com/buy/" + data?.car?.id,
    },
  };
}

export default async function RootLayout({
  children,
}: any) {
    // @ts-expect-error this is because our page is just for view
  return <Page> {children}</Page>;
}
