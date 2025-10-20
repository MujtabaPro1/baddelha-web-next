'use client'
import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Heart, MapPin, Fuel, Calendar, Settings, ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import { InstantWrapper } from '../../providers/InstantProvider';
import { useHits, useInstantSearch, useStats } from "react-instantsearch";
import { PaginationComponent } from '../../components/pagination';
import { Filters } from '../../components/filters';
import { SearchBox } from '../../components/search';

const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const makes = ['All Makes', 'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Tesla', 'Toyota'];
const bodyTypes = ['All Types', 'Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible'];
const fuelTypes = ['All Fuel Types', 'Gasoline', 'Hybrid', 'Electric', 'Diesel'];
const conditions = ['All Conditions', 'New', 'Used', 'Certified Pre-Owned'];
const locations = ['All Locations', 'Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'];


const CarView = ({viewMode,likedCars,toggleLike}: {viewMode: 'grid' | 'list',likedCars: Set<number>,toggleLike: (carId: number) => void}) => {

  const { hits } = useHits();
  const { status } = useInstantSearch();

  console.log('hits',hits);
  console.log('status',status);
  if(status == 'loading'){
    return <div>Loading...</div>
  }


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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('All Makes');
  const [selectedBodyType, setSelectedBodyType] = useState('All Types');
  const [selectedFuelType, setSelectedFuelType] = useState('All Fuel Types');
  const [selectedCondition, setSelectedCondition] = useState('All Conditions');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [yearRange, setYearRange] = useState([2020, 2024]);
  const [mileageRange, setMileageRange] = useState([0, 50000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('price-low');
  const [showFilters, setShowFilters] = useState(false);
  const [likedCars, setLikedCars] = useState<Set<number>>(new Set());
  const [carList,setCarList] = useState([]);

  const toggleLike = (carId: number) => {
    const newLikedCars = new Set(likedCars);
    if (newLikedCars.has(carId)) {
      newLikedCars.delete(carId);
    } else {
      newLikedCars.add(carId);
    }
    setLikedCars(newLikedCars);
  };

  const clearFilters = () => {
    setSelectedMake('All Makes');
    setSelectedBodyType('All Types');
    setSelectedFuelType('All Fuel Types');
    setSelectedCondition('All Conditions');
    setSelectedLocation('All Locations');
    setPriceRange([0, 300000]);
    setYearRange([2020, 2024]);
    setMileageRange([0, 50000]);
    setSearchTerm('');
  };

  const activeFiltersCount = [
    selectedMake !== 'All Makes',
    selectedBodyType !== 'All Types',
    selectedFuelType !== 'All Fuel Types',
    selectedCondition !== 'All Conditions',
    selectedLocation !== 'All Locations',
    priceRange[0] !== 0 || priceRange[1] !== 300000,
    yearRange[0] !== 2020 || yearRange[1] !== 2024,
    mileageRange[0] !== 0 || mileageRange[1] !== 50000
  ].filter(Boolean).length;

  const FilterView = (isShowFilter: boolean) => {

    if(!isShowFilter){
      return null;
    }

    return  <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
    <div className="hidden bg-white rounded-xl shadow-md p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Make Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
          >
            {makes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>

        {/* Body Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
          <select
            value={selectedBodyType}
            onChange={(e) => setSelectedBodyType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
          >
            {bodyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
          >
            {conditions.map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        {/* Fuel Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
          <select
            value={selectedFuelType}
            onChange={(e) => setSelectedFuelType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
          >
            {fuelTypes.map(fuel => (
              <option key={fuel} value={fuel}>{fuel}</option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range: SAR {priceRange[0].toLocaleString()} - SAR {priceRange[1].toLocaleString()}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="300000"
              step="5000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="300000"
              step="5000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>

        {/* Year Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year: {yearRange[0]} - {yearRange[1]}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="2015"
              max="2024"
              value={yearRange[0]}
              onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
              className="w-full"
            />
            <input
              type="range"
              min="2015"
              max="2024"
              value={yearRange[1]}
              onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>

        {/* Mileage Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mileage: {mileageRange[0].toLocaleString()} - {mileageRange[1].toLocaleString()} km
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={mileageRange[0]}
              onChange={(e) => setMileageRange([parseInt(e.target.value), mileageRange[1]])}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={mileageRange[1]}
              onChange={(e) => setMileageRange([mileageRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
    <Filters/>
  </div>

  }

  useEffect(() => {
     getCars();
  }, []);

  const getCars = () => {
    axiosInstance.get('/api/1.0/car/get-all?page=1&limit=12')
    .then(response => {
      const cars: [] = response.data?.data.filter((car: any) => car.carStatus != 'push_to_auction' && car?.carStatus != 'pending_inspection');
      console.log('cars',cars);
      setCarList(cars);
    })
    .catch(error => {
      console.error('Error fetching cars:', error);
    }); 
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
    <InstantWrapper searchIndex={'cars'} >
    <div className="min-h-screen bg-gray-50 pt-[60px]">
      {/* Hero Section */}
      <div className="bg-[#3d3d40] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Car
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Browse thousands of quality vehicles from trusted dealers across Saudi Arabia
            </p>
            
            {/* Search Bar */}
            <SearchBox />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 py-4 pb-[200px]">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {FilterView(true)}


          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Head/>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs px-2 py-1 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                    >
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="year-new">Year: Newest First</option>
                      <option value="year-old">Year: Oldest First</option>
                      <option value="mileage-low">Mileage: Low to High</option>
                      <option value="mileage-high">Mileage: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
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

            {/* Car Listings */}
            {carList.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No cars found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-amber-500 to-amber-400 text-white px-6 py-2 rounded-lg hover:bg-[#e67d26] transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                <CarView viewMode={viewMode} likedCars={likedCars} toggleLike={toggleLike} />
              </div>
            )}
          </div>
        </div>
        <PaginationComponent/>
      </div>
    </div>
    </InstantWrapper>
  );
}



const CarCard: React.FC<{ car: any; viewMode: string; isLiked: boolean; onToggleLike: () => void }> = ({ car, viewMode, isLiked, onToggleLike }) => {
  console.log('CarCard');
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-80 relative">
            <img 
              src={car?.imageUrl || 'https://miamiconcours.com/wp-content/themes/miami/assets/image/vote-placeholder.png'}
                 alt={`${car.modelYear} ${car.make} ${car.model}`}
              className="w-full h-48 md:h-full object-cover"
              onError={()=>{
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
                href={`/car/${car.make + '-' + car.model + '-' + car.modelYear}/${car.id}`}
                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white px-4 py-2 rounded-lg transition text-sm">
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={car?.imageUrl || 'https://miamiconcours.com/wp-content/themes/miami/assets/image/vote-placeholder.png'} 
          alt={`${car.modelYear} ${car.make} ${car.model}`}
          className="w-full h-[280px] object-cover"
          onError={()=>{
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
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900">
            {car.make} {car.model} {car.modelYear}
            </h3>
            <p className="text-gray-600 text-sm">{car.bodyType}</p>
          </div>
      
        </div>
        
        <div className="grid grid-cols-2 gap-y-3 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Settings className="h-4 w-4 mr-2 text-[#f78f37]" />
            <span className="font-bold">{car.exactMileage || '0'} km</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Fuel className="h-4 w-4 mr-2 text-[#f78f37]" />
            <span className="font-bold">{car.fuelType || 'Petrol'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-[#f78f37]" />
            <span className="font-bold">{car.transmission || 'Automatic'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-[#f78f37]" />
            <span className="font-bold">{car.location || 'Saudi Arabia'}</span>
          </div>
        </div>

       

        <div className="text-xs text-gray-600 mb-4">
          Sold by: <span className="font-medium"><span className="font-medium">{car?.organizationId ? 'Company' : 'Private'}</span></span>
        </div>
        

        <div className="flex justify-between items-center mb-4">
            <div className="font-bold text-md text-[#3d3d40]">
              SAR {numberWithCommas(car?.sellingPrice || car.bookValue)}
            </div>
            <div className="text-xs text-gray-600">Est. SAR {((car?.sellingPrice || car.bookValue) / 50).toFixed(0).toLocaleString()}/mo</div>
          </div>

        <div className="flex gap-2">
          <a 
          href={`/car/${car.make + '-' + car.model + '-' + car.modelYear}/${car.id}`}
           className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white py-2 px-3 rounded-lg transition text-sm text-center">
            View Details
          </a>
          {/* <a href="#" className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white py-2 px-3 rounded-lg transition text-sm text-center">
            Inquire
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default Buy;
