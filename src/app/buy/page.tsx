'use client'
import React, { useState } from 'react';
import { Filter, Grid, List, Heart, MapPin, Fuel, Calendar, Settings, ChevronDown, X } from 'lucide-react';
import { InstantWrapper } from '../../providers/InstantProvider';
import { useHits, useInstantSearch, useStats } from "react-instantsearch";
import { PaginationComponent } from '../../components/pagination';
import { Filters } from '../../components/filters';
import { SearchBox } from '../../components/search';
import { BASE_URL } from '../../services/axiosInstance';


const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};



const CarView = ({viewMode,likedCars,toggleLike}: {viewMode: 'grid' | 'list',likedCars: Set<number>,toggleLike: (carId: number) => void}) => {

  console.log('CarView');
  const { hits, results } = useHits();
  const { status } = useInstantSearch();

  console.log('hits',hits);
  console.log('results',results);
  console.log('status',status);
  // if(status == 'loading'){
  //   return <div>Loading...</div>
  // }


  return <>{hits.map((car: any) => (
    <CarCard 
      key={car.id} 
      car={car} 
      viewMode={viewMode}
      isLiked={likedCars.has(car.id)}
      onToggleLike={() => toggleLike(car.id)}
    />
  ))}</>

}

function Buy() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('cars');
  const [showFilters, setShowFilters] = useState(false);
  const [likedCars, setLikedCars] = useState<Set<number>>(new Set());

  const toggleLike = (carId: number) => {
    const newLikedCars = new Set(likedCars);
    if (newLikedCars.has(carId)) {
      newLikedCars.delete(carId);
    } else {
      newLikedCars.add(carId);
    }
    setLikedCars(newLikedCars);
  };

  const FilterView = () => {
    return (
      <div className="lg:w-72 sticky top-24">
        <Filters />
      </div>
    );
  }




  const Head = () => {
    const { nbHits } = useStats();


    return (
      <h2 className="text-xl font-semibold">
      {nbHits} Cars Found
    </h2>
    );
};




  return (
    <InstantWrapper searchIndex={sortBy} >
    <div className="min-h-screen bg-gray-50 pt-[60px]">
      {/* Hero Section */}
      <div className="bg-[#3d3d40] text-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Find Your Perfect Car
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-xl text-gray-200 mb-6 sm:mb-8">
              Browse thousands of quality vehicles from trusted dealers across Saudi Arabia
            </p>

            {/* Search Bar */}
            <SearchBox />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-3 md:px-4 py-2 sm:py-4 pb-[200px]">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block">
            <FilterView />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 md:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                  <Head/>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-xs sm:text-sm"
                  >
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Filters
                  </button>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
                  {/* Sort Dropdown */}
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={sortBy}
                      onChange={(e) => {
            
                        setSortBy(e.target.value);
                      }}
                      className="appearance-none w-full min-w-[180px] sm:w-auto bg-white border border-gray-300 rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 pr-7 sm:pr-8 focus:ring-2 focus:ring-[#f78f37] focus:border-transparent text-xs sm:text-sm"
                    >
                       <option value="cars">Recommended</option>
                      <option value="cars:sellingPrice:asc">Price: Low to High</option>
                      <option value="cars:sellingPrice:desc">Price: High to Low</option>
                      <option value="cars:createdAt:desc">Year: Newest First</option>
                      <option value="cars:createdAt:asc">Year: Oldest First</option>
                      {/* <option value="mileage:asc">Mileage: Low to High</option>
                      <option value="mileage:desc">Mileage: High to Low</option> */}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Toggle */}
                  <div className="hidden flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition ${
                        viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition ${
                        viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filters - shown when showFilters is true */}
            {showFilters && (
              <div className="lg:hidden mb-4 rounded-xl shadow-md overflow-hidden relative">
                <button
                  onClick={() => setShowFilters(false)}
                  className="absolute top-3 right-3 z-10 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="max-h-[50vh] overflow-y-auto">
                  <Filters/>
                </div>
              </div>
            )}

            <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6'
                : 'space-y-3 sm:space-y-4'
              }>
                <CarView viewMode={viewMode} likedCars={likedCars} toggleLike={toggleLike} />
              </div>
          </div>
        </div>
        <PaginationComponent/>
      </div>
    </div>
    </InstantWrapper>
  );
}



const CarCard: React.FC<{ car: any; viewMode: string; isLiked: boolean; onToggleLike: () => void }> = ({ car, viewMode, isLiked, onToggleLike }) => {
  const [isError,setError] = useState(false);


  if (viewMode === 'list') {

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-80 relative">
            
            <img 
              src={isError ? 'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=' :  BASE_URL + '/api/1.0/media/' + car?.imageUrl}
                 alt={`${car.modelYear} ${car.make} ${car.model}`}
              className="w-full h-48 md:h-full object-cover"
              onError={()=>{
                setError(true);
                console.log('onError');
              }}
            />
            <button
              onClick={onToggleLike}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition"
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>

          </div>
          
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                {car.make} {car.model} {car.modelYear} 
                </h3>
                <p className="text-gray-600">{car.bodyType}</p>
              </div>
              <div className="text-right">
                {car.sellingPrice || car.bookValue && (
                  <div className="text-xl font-bold">
                    SAR {car.sellingPrice || car.bookValue}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm h-[60px]">
              <div className="flex items-start flex-col text-gray-600">
                <p className="font-medium">Mileage &nbsp;</p>
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-[#f78f37]" />
                  <span className="font-bold">{car.exactMileage || '0'} km</span>
                </div>
              </div>
              <div className="flex items-start flex-col text-gray-600">
                <p className="font-medium">Fuel Type &nbsp;</p>
                <div className="flex items-center">
                  <Fuel className="h-4 w-4 mr-2 text-[#f78f37]" />
                  <span className="font-bold">{car.fuelType || 'Petrol'}</span>
                </div>
              </div>
              <div className="flex items-start flex-col text-gray-600">
                <p className="font-medium">Transmission &nbsp;</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-[#f78f37]" />
                  <span className="font-bold">{car.transmission || 'Automatic'}</span>
                </div>
              </div>
              <div className="flex flex-col items-start text-gray-600">
                <p className="font-medium">Location &nbsp;</p>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-[#f78f37]" />
                  <span className="font-bold">{car.location || 'Saudi Arabia'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Sold by: <span className="font-medium">{car?.organizationId ? 'Company' : 'Private'}</span>
              </div>
              <div className="flex gap-2">
                <a
                href={`/buy/${car.make + '-' + car.model + '-' + car.modelYear}/${car.id}`}
                className="bg-primaryBtn hover:bg-primaryBtn text-white px-4 py-2 rounded-lg transition text-sm">
                  View Details
                </a>
                {/* <button className="bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white px-4 py-2 rounded-lg transition text-sm">
                  Contact Dealer
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={isError ? 'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=' :  BASE_URL + '/api/1.0/media/' +  car?.imageUrl} 
          alt={`${car.modelYear} ${car.make} ${car.model}`}
          className="w-full h-[180px] object-cover"
          onError={()=>{
            console.log('onError');
            setError(true);
          }}
        />
      
        <button
          onClick={onToggleLike}
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white transition"
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        
      </div>
      
      <div className="p-3">
        <div className="mb-2">
          <h3 className="font-bold text-base text-gray-900 line-clamp-1">
            {car.make} {car.model} {car.modelYear}
          </h3>
          <p className="text-gray-600 text-xs">{car.bodyType}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-3 text-xs">
          <div className="flex items-center text-gray-600">
            <Settings className="h-3.5 w-3.5 mr-1.5 text-[#f78f37]" />
            <span className="font-medium truncate">{car.exactMileage || '0'} km</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Fuel className="h-3.5 w-3.5 mr-1.5 text-[#f78f37]" />
            <span className="font-medium truncate">{car.fuelType || 'Petrol'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-[#f78f37]" />
            <span className="font-medium truncate">{car.transmission || 'Automatic'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-[#f78f37]" />
            <span className="font-medium truncate">{car.location || 'Saudi Arabia'}</span>
          </div>
        </div>

        <div className="text-xs text-gray-600 mb-2">
          <span className="font-medium">{car?.organizationId ? 'Company' : 'Private'}</span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="font-bold text-base text-[#3d3d40]">
            SAR {numberWithCommas(car?.sellingPrice || car.bookValue)}
          </div>
          <div className="text-xs text-gray-500">SAR {((car?.sellingPrice || car.bookValue) / 50).toFixed(0)}/mo</div>
        </div>

        <a 
          href={`/buy/${car.make + '-' + car.model + '-' + car.modelYear}/${car.id}`}
          className="block w-full bg-primaryBtn hover:bg-primaryBtn text-white py-2 px-3 rounded-lg transition text-sm text-center font-medium"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

export default Buy;
