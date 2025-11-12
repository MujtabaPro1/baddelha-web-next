// app/sitemap.ts
import { MetadataRoute } from 'next';
import serverAxiosInstance from '../services/serverAxiosInstance';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all cars
  let carUrls: MetadataRoute.Sitemap = [];
  
  try {
    const carsResponse = await serverAxiosInstance.get('/api/1.0/car/get-all');
    const cars = carsResponse.data?.cars || [];
    
    carUrls = cars.map((car: {id: string}) => ({
      url: `https://baddelha.com/buy/${car.id}`,
      lastModified: new Date(),
      // changeFrequency is removed as it's not a valid property in MetadataRoute.Sitemap
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Failed to fetch cars for sitemap:', error);
    // Continue with empty car URLs
  }
  
  // Static pages
  const routes = [
    '',
    '/buy',
    '/tradein',
    '/about',
    '/contactus',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `https://baddelha.com${route}`,
    lastModified: new Date(),
    // Removed changeFrequency as it's not a valid property in MetadataRoute.Sitemap
    priority: route === '' ? 1.0 : 0.7,
  }));
  
  return [...routes, ...carUrls];
}