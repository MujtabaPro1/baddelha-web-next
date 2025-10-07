import { Metadata } from "next";
import Page from "../[id]/page";
import { Props } from "next/script";


export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
  searchParams
}: Props): Promise<Metadata> {
  // fetch data
   

  const data = await fetch(`https://stg-service.bddelha.com/api/1.0/car/car-details/${params.id}`
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
      url: "localhost:3000/car/" + data?.car?.id,
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: any;
}) {
  return <Page> {children}</Page>;
}
