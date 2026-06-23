'use client';
import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  Fuel, 
  Car,
  Check,
  ArrowRight,
  Shield,
  Award,
  Star,
  Zap,
  Wrench,
  FileText,
  ThumbsUp,
  Plus,
  Info,
  CheckCircle2Icon,
  Gauge,
  Settings,
  Phone,
  Lock,
  } from 'lucide-react';
import axiosInstance, { BASE_URL } from '../../../../services/axiosInstance';
import { inspectionData, numberWithCommas } from '../../../../lib/utils';
import CarBodySvgView from '../../../../components/CarBodyView';
import { useParams } from 'next/navigation';
import { Popover, PopoverTrigger, PopoverContent } from '../../../../components/ui/popover';
import { useLanguage } from '../../../../contexts/LanguageContext';
import lang from '../../../../locale';
import { Skeleton } from '../../../../components/ui/skeleton';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import LoginModal from '../../../../components/LoginModal';


function VehicleCard ({car,lang,language}: {car:any,lang:any,language: string}) {

  const [isError,setIsError] = useState(false);

  return   <div
  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition">
                        <div className="relative">

                          <img
                             src={isError ? 'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=' :  BASE_URL + '/api/1.0/media/' + car?.coverImage}
                            alt={car?.make + '-' + car?.model} 
                            onError={()=>{
                              setIsError(true);
                            }}
                            className="w-full h-36 object-cover" />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-800 mb-1 truncate text-ellipsis text-sm">{car?.make}&nbsp;{car?.model}</h4>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-[#f78f37] text-sm">{car.price}</span>
                            <span className="text-xs text-gray-500">{car?.exactMileage || car?.mileage}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 mb-2">
                            <div className="flex items-center text-xs text-gray-600">
                              <Calendar className="h-3 w-3 mr-1" /> {car?.modelYear}
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Fuel className="h-3 w-3 mr-1" /> {car?.fuelType}
                            </div>
                          </div>
                          <button className="w-full bg-[#f78f37] hover:bg-[#e67d26] text-white text-xs font-medium py-1.5 px-2 rounded-lg transition">
                            {lang[language].viewDetails}
                          </button>
                        </div>
                      </div>
}

export default function Page() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMainImageError, setIsMainImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'features' | 'inspection'>('overview');
  const [car, setCar] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [inspectionImages,setInspectionImage] = useState(null)
  const [inspectionDetails, setInspectionDetails]: any = useState(null);
  const [inspectionSchema, setInspectionSchema]: any = useState(null);
  const [extraData, setExtraData] = useState<any>(null);
  const [similarCars, setSimilarCars] = useState<any>([]);
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const checkAuthState = () => {
      const authToken = localStorage.getItem('authToken') || localStorage.getItem('token');
      setIsAuthenticated(!!authToken);
    };
    checkAuthState();
    window.addEventListener('authStateChanged', checkAuthState);
    return () => window.removeEventListener('authStateChanged', checkAuthState);
  }, []);


  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };
  
  
  // These state variables are initialized but not currently used
  // They are kept for future implementation of dynamic data loading



  const nextImage = () => {
    if (images.length === 0) return;
    setIsMainImageError(false);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length === 0) return;
    setIsMainImageError(false);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };



   useEffect(()=>{
      // Extract car ID from URL
      const id = params?.id;
      
      if (id) {
         carDetails(id);
      }
   },[params?.id]);

   const carDetails = (id: any) => {
          axiosInstance.get('/api/1.0/car/car-details-v2/' + id).then((res)=>{
              // Process car data
              const _car = res?.data?.car;
              const _inspectionData = inspectionData;
              console.log(_car);
              
              // Process inspection data if available
              if(_car['Inspection'] && _car['Inspection'].length){
                  _car['InspectionData'] = _car?.Inspection?.[0]?.inspectionJson;
                  // Sample extraData for testing
                  const _extraData = _car['InspectionData'].extraData || {};
                  
                  setExtraData(_extraData);
                  
                  _inspectionData.forEach((i) => {
                      i.fields.forEach((_i: any) => {
                          Object.keys(_car['InspectionData']).forEach((cKey) => {
                              if(cKey.replace(/_/g, " ") == _i.fieldName){
                                  if(cKey == 'Warranty_Valid_Till'){
                                      _i.value = _car['InspectionData'][cKey] ? new Date(_car['InspectionData'][cKey]).toDateString() : 'N/A';
                                  }
                                  else if(cKey == 'Service_Plan_Valid_Till'){
                                      _i.value = _car['InspectionData'][cKey] ? new Date(_car['InspectionData'][cKey]).toDateString(): 'N/A';
                                  }
                                  else{
                                      _i.value = _car['InspectionData'][cKey] ;
                                  }
                                  
                                  // Check if this field has extra data
                                  if (_extraData && _extraData[cKey]) {
                                      _i.hasExtraData = true;
                                      _i.extraDataKey = cKey;
                                  }
                              }
                          });
                      });
                      (i as any)['isHidden'] = i.name != 'General Information';
  
                      if(_car['InspectionData'].overview){
                          (i as any)['overview'] = _car['InspectionData'].overview[i.name];
                      }
                  })
              }
              _car['InspectionData'] = _inspectionData;
              
              // Set car data
              setCar(_car);

              getSimilarCar(_car.make,_car.model,_car.modelYear);

              if(res?.data?.car?.Inspection?.length){
              setInspectionDetails(res?.data?.car?.Inspection?.[0]);
              setInspectionSchema(res?.data?.car?.Inspection?.[0]?.inspectionJson);
              }
              
              // Process images
              if (res?.data?.images && res.data.images.length > 0) {
                  // Reorder images if needed
                  let carImageUrls = res.data.images.map((img: any)=> img.caption && (img.caption == 'Front' || img.caption == 'Back' || img.caption == 'Left' || img.caption == 'Right') ? img : null).filter((img: any) => img !== null);
                  const otherImages = res.data.images.map((img: any)=> img.caption && (img.caption != 'Front' && img.caption != 'Back' && img.caption != 'Left' && img.caption != 'Right' && img.caption != 'Seller ID Front' && img.caption != 'Seller ID Back' && img.caption != 'Registration Sticker' && img.caption != 'VIN Number Plate' && img.caption != 'VIN Number Plate Firewall') ? img : null).filter((img: any) => img !== null);
                  carImageUrls = carImageUrls.map((im: any)=> im.url || im.imageUrl || im);
                  setImages(carImageUrls);
                  setInspectionImage(otherImages);
              } else if (_car.images && _car.images.length > 0) {
                  // Use car images if available
                  setImages(_car.images);
              }
              else if (res?.data?.carImages && res.data.carImages.length > 0) {
                  const carImageUrls = res.data.carImages.map((img: any) => img.url || img.imageUrl || img);
                  setImages(carImageUrls);
              }
              
              // Process car videos if available
              if (res?.data?.carImages) {
                  const videos = res.data.carImages.filter((i: any) => i.fileType && i.fileType.includes('video'));
                  if (videos.length > 0) {
                      // Handle videos if needed
                      console.log('Videos available:', videos.length);
                  }
              }
              setTimeout(() => {
                setLoading(false);
              }, 2000);
          }).catch((err)=>{
              console.log('err',err);
              setTimeout(() => {
                setLoading(false);
              }, 2000);
          })
      };


      const getSimilarCar = (make:string,model:string,year:string) => {
           axiosInstance.get('/api/1.0/car/similar?page=1&limit=10&make=' + make + '&model=' + model + '&year=' + year).then((res)=>{
            setSimilarCars(res?.data?.data);
           }).catch((err)=>{
              console.log('err',err);
           })
      }


 
      if(loading){
        return (
          <div className="min-h-screen bg-white lg:mt-[80px] mt-[120px]">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
              {/* Breadcrumb */}
              <div className="mb-4 flex items-center gap-2">
                <Skeleton className="h-4 w-12 bg-gray-200" />
                <Skeleton className="h-4 w-4 bg-gray-200" />
                <Skeleton className="h-4 w-16 bg-gray-200" />
                <Skeleton className="h-4 w-4 bg-gray-200" />
                <Skeleton className="h-4 w-20 bg-gray-200" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Image Gallery */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <Skeleton className="h-48 sm:h-64 md:h-80 lg:h-96 w-full bg-gray-200 rounded-none" />
                    <div className="flex space-x-1 sm:space-x-2 overflow-x-auto p-2 sm:p-3">
                      {[0, 1, 2, 3].map((i) => (
                        <Skeleton key={i} className="w-14 h-12 sm:w-20 sm:h-16 bg-gray-200 flex-shrink-0" />
                      ))}
                    </div>
                  </div>

                  {/* Title / Location / Badges */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 space-y-3">
                    <Skeleton className="h-6 sm:h-7 w-2/3 bg-gray-200" />
                    <Skeleton className="h-4 w-1/3 bg-gray-200" />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[0, 1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-8 w-24 rounded-full bg-gray-200" />
                      ))}
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex border-b border-gray-200 px-4 sm:px-6 gap-6 py-3">
                      <Skeleton className="h-5 w-16 bg-gray-200" />
                      <Skeleton className="h-5 w-24 bg-gray-200" />
                      <Skeleton className="h-5 w-32 bg-gray-200" />
                    </div>
                    <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-10 w-full bg-gray-200" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-6 lg:col-span-1">
                  {/* Price / Actions */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4">
                    <Skeleton className="h-4 w-20 bg-gray-200" />
                    <Skeleton className="h-7 w-32 bg-gray-200" />
                    <Skeleton className="h-12 w-full rounded-lg bg-gray-200" />
                    <Skeleton className="h-12 w-full rounded-lg bg-gray-200" />
                    <div className="space-y-4 pt-2">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-2/3 bg-gray-200" />
                          <Skeleton className="h-3 w-full bg-gray-200" />
                          <Skeleton className="h-3 w-5/6 bg-gray-200" />
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-2/3 bg-gray-200" />
                          <Skeleton className="h-3 w-full bg-gray-200" />
                          <Skeleton className="h-3 w-5/6 bg-gray-200" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seller Information */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4">
                    <Skeleton className="h-5 w-36 bg-gray-200" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-200 flex-shrink-0" />
                      <Skeleton className="h-4 w-32 bg-gray-200" />
                    </div>
                    <Skeleton className="h-4 w-1/2 bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      const isCertifiedSeller = !car?.seller?.name;

  return (
    <>
    <div className="min-h-screen bg-white lg:mt-[80px] mt-[120px]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
            <a href="/buy" className="hover:text-[#f78f37] transition whitespace-nowrap">{lang[language].buy}</a>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <a href="/buy" className="hover:text-[#f78f37] transition whitespace-nowrap">{car?.make}</a>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-gray-900 whitespace-nowrap">{car?.model}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
          {/* Left Column - Images and Main Info (Image and Title only) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Slider */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative bg-gray-100">
                <img
                  src={isMainImageError ? 'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=' : (images.length > 0 ? images?.[currentImageIndex] : car?.images?.[currentImageIndex])}
                  alt={car ? `${car.year || ''} ${car.make || ''} ${car.model || ''}` : `${car?.year} ${car?.make} ${car?.model}`}
                  onError={() => setIsMainImageError(true)}
                  className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition"
                    >
                      <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 0 && (
                  <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/70 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex space-x-1 sm:space-x-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="bg-white/90 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-md transition"
                  >
                    <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? 'fill-[#f78f37] text-[#f78f37]' : 'text-gray-600'}`} />
                  </button>
                  <button className="bg-white/90 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-md transition">
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="p-2 sm:p-4">
                <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
                  {(images.length > 0 ? images : []).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => { setIsMainImageError(false); setCurrentImageIndex(index); }}
                      className={`flex-shrink-0 w-14 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden border-2 transition ${
                        index === currentImageIndex ? 'border-[#f78f37]' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Car Title and Basic Info */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4 gap-2">
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                    {car ? `${car.year || ''} ${car.make || ''} ${car.model || ''}` : `${car?.year} ${car?.make} ${car?.model}`}
                  </h1>
                  <div className="flex items-center mt-2 text-gray-600 text-xs sm:text-sm">
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {car?.location || lang[language].defaultLocation}
                    </span>
                  </div>
                </div>
                <div className="text-right sm:mt-0 mt-2 lg:hidden">
                  <div className="text-xl sm:text-2xl font-bold text-[#f78f37]">
                    SAR {numberWithCommas(car?.sellingPrice || car?.bookValue)}
                  </div>
                </div>
              </div>

              {/* Quick Spec Pills */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                  <Gauge className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#f78f37]" />
                  {car?.exactMileage ? car.exactMileage.toLocaleString() : car?.mileage ? car.mileage.toLocaleString() : '42,500'} km
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#f78f37]" />
                  {car?.modelYear || '2022'}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                  <Fuel className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#f78f37]" />
                  {car?.fuelType || lang[language].defaultFuelType}
                </span>
              </div>
            </div>

          {/* Specifications Section - full width below image+price */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex px-3 sm:px-4 overflow-x-auto">
                  {[
                    { id: 'overview', label: lang[language].overview },
                    { id: 'specifications', label: lang[language].specifications },
                    { id: 'inspection', label: lang[language].inspectionReport },
                    isCertifiedSeller ? null : { id: 'features', label: lang[language].keyFeatures },
                  ].map((item) => {
                    if (!item) return null;
                    const { id, label } = item;
                    return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      className={`py-3 sm:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition whitespace-nowrap ${
                        activeTab === id
                          ? 'border-[#f78f37] text-[#f78f37]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
                </nav>
              </div>

              <div className="p-4 sm:p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-2 gap-y-5 gap-x-4 sm:gap-x-8">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">{lang[language].make}</div>
                      <div className="font-semibold text-sm sm:text-base">{car?.make || lang[language].defaultMake}</div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">{lang[language].model}</div>
                      <div className="font-semibold text-sm sm:text-base">{car?.model || lang[language].defaultModel}</div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">{lang[language].year}</div>
                      <div className="font-semibold text-sm sm:text-base">{car?.modelYear || '2022'}</div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">{lang[language].bodyType}</div>
                      <div className="font-semibold text-sm sm:text-base">{car?.bodyType || lang[language].defaultBodyType}</div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">{lang[language].exteriorColor}</div>
                      <div className="font-semibold text-sm sm:text-base">{car?.exteriorColor || lang[language].defaultExteriorColor}</div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">{lang[language].interiorColor}</div>
                      <div className="font-semibold text-sm sm:text-base">{car?.interiorColor || lang[language].defaultInteriorColor}</div>
                    </div>
                  </div>
                )}

                {/* Specifications Tab */}
                {activeTab === 'specifications' && (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      <div className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-lg py-3 px-2 text-center">
                        <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37]" />
                        <div className="text-xs sm:text-sm text-gray-500">{lang[language].transmission}</div>
                        <div className="font-semibold text-sm sm:text-base">{car?.transmission || lang[language].defaultTransmission}</div>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-lg py-3 px-2 text-center">
                        <Car className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37]" />
                        <div className="text-xs sm:text-sm text-gray-500">{lang[language].seats}</div>
                        <div className="font-semibold text-sm sm:text-base">{car?.seats || '5'}</div>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-lg py-3 px-2 text-center">
                        <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37]" />
                        <div className="text-xs sm:text-sm text-gray-500">{lang[language].engine}</div>
                        <div className="font-semibold text-sm sm:text-base">{car?.engine || lang[language].defaultEngine}</div>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-lg py-3 px-2 text-center">
                        <Fuel className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37]" />
                        <div className="text-xs sm:text-sm text-gray-500">{lang[language].fuelType}</div>
                        <div className="font-semibold text-sm sm:text-base">{car?.fuelType || lang[language].defaultFuelType}</div>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-lg py-3 px-2 text-center">
                        <Gauge className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37]" />
                        <div className="text-xs sm:text-sm text-gray-500">{lang[language].driveType}</div>
                        <div className="font-semibold text-sm sm:text-base">{car?.driveType || lang[language].defaultDriveType}</div>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-lg py-3 px-2 text-center">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37]" />
                        <div className="text-xs sm:text-sm text-gray-500">{lang[language].doors}</div>
                        <div className="font-semibold text-sm sm:text-base">{car?.doors || '5'}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 sm:mt-4 bg-gray-50 rounded-lg py-3 px-4">
                      <span className="text-xs sm:text-sm text-gray-500">{lang[language].vin}</span>
                      <span className="text-xs sm:text-sm font-medium font-mono">{car?.vin || 'JTMWRREV7ND123456'}</span>
                    </div>
                  </div>
                )}

                {/* Features Tab */}
                {activeTab === 'features' && !isCertifiedSeller && (
                  <div className="space-y-6 sm:space-y-8">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].keyFeatures}</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {/* Comfort Features */}
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 text-gray-700 flex items-center text-sm sm:text-base gap-1">
                            <Star className="h-4 w-4 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].comfortFeatures}</span>
                          </h4>
                          <ul className="space-y-2">
                            {[
                              'Leather Seats',
                              'Heated Front Seats',
                              'Dual-Zone Climate Control',
                              'Power Adjustable Seats',
                              'Memory Seat Settings',
                              'Panoramic Sunroof'
                            ].map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-[#f78f37] mt-0.5 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Technology Features */}
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 text-gray-700 flex items-center text-sm sm:text-base gap-1">
                            <Zap className="h-4 w-4 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].technologyFeatures}</span>
                          </h4>
                          <ul className="space-y-2">
                            {[
                              'Touchscreen Infotainment System',
                              'Apple CarPlay & Android Auto',
                              'Premium Sound System',
                              'Bluetooth Connectivity',
                              'Wireless Charging',
                              'Digital Instrument Cluster'
                            ].map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-4 w-4 text-[#f78f37] mr-2 mt-0.5" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Safety Features */}
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 text-gray-700 flex items-center text-sm sm:text-base gap-1">
                            <Shield className="h-4 w-4 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].safetyFeatures}</span>
                          </h4>
                          <ul className="space-y-2">
                            {[
                              'Advanced Driver Assistance',
                              'Adaptive Cruise Control',
                              'Lane Keeping Assist',
                              'Blind Spot Monitoring',
                              'Parking Sensors',
                              '360° Camera System'
                            ].map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-4 w-4 text-[#f78f37] mr-2 mt-0.5" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Performance Features */}
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 text-gray-700 flex items-center text-sm sm:text-base gap-1">
                            <Award className="h-4 w-4 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].performanceFeatures}</span>
                          </h4>
                          <ul className="space-y-2">
                            {[
                              'Sport Suspension',
                              'Drive Mode Selection',
                              'Paddle Shifters',
                              'Performance Brakes',
                              'Sport Exhaust System',
                              'Quattro All-Wheel Drive'
                            ].map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-4 w-4 text-[#f78f37] mr-2 mt-0.5" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Exterior Features */}
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 text-gray-700 flex items-center text-sm sm:text-base gap-1">
                            <Car className="h-4 w-4 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].exterior}</span>
                          </h4>
                          <ul className="space-y-2">
                            {[
                              'LED Headlights',
                              'LED Daytime Running Lights',
                              'Power Folding Mirrors',
                              'Alloy Wheels',
                              'Roof Rails',
                              'Tinted Windows'
                            ].map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-4 w-4 text-[#f78f37] mr-2 mt-0.5" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Convenience Features */}
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 text-gray-700 flex items-center text-sm sm:text-base gap-1">
                            <ThumbsUp className="h-4 w-4 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].convenienceFeatures}</span>
                          </h4>
                          <ul className="space-y-2">
                            {[
                              'Keyless Entry & Start',
                              'Remote Start',
                              'Power Tailgate',
                              'Auto-Dimming Mirrors',
                              'Rain-Sensing Wipers',
                              'Ambient Interior Lighting'
                            ].map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-4 w-4 text-[#f78f37] mr-2 mt-0.5" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Features */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].additionalFeaturesTitle}</span>
                      </h3>
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-700 mb-4">
                          {lang[language].additionalFeaturesSubtitle}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <h4 className="font-semibold mb-2 text-gray-700 text-sm">{lang[language].premiumPackage}</h4>
                            <ul className="space-y-1">
                              {[
                                'Bang & Olufsen Sound System',
                                'Head-up Display',
                                'Ventilated Front Seats',
                                'Heated Rear Seats'
                              ].map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-[#f78f37] mt-0.5 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-gray-700 text-sm">{lang[language].sportPackage}</h4>
                            <ul className="space-y-1">
                              {[
                                'Sport Seats',
                                'Sport Steering Wheel',
                                'Black Optic Package',
                                'Sport Suspension'
                              ].map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-[#f78f37] mt-0.5 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Inspection Tab - Unverified Glimpse */}
                {activeTab === 'inspection' && !isAuthenticated && (
                  <div className="space-y-6">
                    {/* Inspection Summary - visible glimpse */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].inspectionSummary}</span>
                      </h3>

                      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                        {/* Inspection Score */}
                        <div className="mb-6 sm:mb-8">
                          <div className="flex justify-between items-center mb-4 gap-2">
                            <h4 className="font-semibold text-gray-700 text-sm sm:text-base">{lang[language].overallCondition}</h4>
                            <div className="bg-gradient-to-r from-[#f78f37] to-[#ffac5f] text-white font-bold px-3 py-1 rounded-full text-xs sm:text-sm">
                              {lang[language].excellent}
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-[#f78f37] to-[#ffac5f] h-2.5 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{lang[language].fair}</span>
                            <span>{lang[language].excellent}</span>
                          </div>
                        </div>

                        {/* Key Inspection Points */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center mb-2">
                              <Wrench className="h-5 w-5 text-[#f78f37] mr-2" />
                              <h5 className="font-semibold text-gray-700">{lang[language].mechanical}</h5>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{lang[language].condition}</span>
                              <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                {lang[language].excellent}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center mb-2">
                              <Car className="h-5 w-5 text-[#f78f37] mr-2" />
                              <h5 className="font-semibold text-gray-700">{lang[language].exterior}</h5>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{lang[language].condition}</span>
                              <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                {lang[language].veryGood}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center mb-2">
                              <Star className="h-5 w-5 text-[#f78f37] mr-2" />
                              <h5 className="font-semibold text-gray-700">{lang[language].interior}</h5>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{lang[language].condition}</span>
                              <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                {lang[language].excellent}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed report - blurred teaser with verify CTA */}
                    <div className="relative">
                      <div className="pointer-events-none select-none blur-sm opacity-60">
                        <h4 className="font-semibold text-gray-700 mb-4 text-sm sm:text-base">{lang[language].detailedInspectionReport}</h4>
                        <div className="space-y-3">
                          {[0, 1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 flex items-center gap-3">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#f78f37] to-[#ffac5f] flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs sm:text-sm font-bold">{i + 1}</span>
                              </div>
                              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 sm:p-8 text-center max-w-sm">
                          <Lock className="h-9 w-9 sm:h-10 sm:w-10 mx-auto text-gray-400 mb-3" />
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                            {lang[language].loginToViewInspection || 'Verify your phone to view the inspection report'}
                          </h3>
                          <p className="text-sm text-gray-500 mb-5">
                            {lang[language].loginToViewInspectionDesc || 'Quickly verify your phone number to unlock the full inspection report for this car.'}
                          </p>
                          <button
                            onClick={() => setShowLoginModal(true)}
                            className="bg-[#f78f37] hover:bg-[#e67d26] text-white font-medium py-2.5 px-6 rounded-lg transition"
                          >
                            {lang[language].loginToView || 'Verify to Continue'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'inspection' && isAuthenticated && (
                  <div className="space-y-8">
                    {/* Inspection Summary */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].inspectionSummary}</span>
                      </h3>
                      
                      {!inspectionDetails?.inspectionJson ? (
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                          <p className="text-gray-500">{lang[language].noInspectionReport}</p>
                        </div>
                      ) : !inspectionSchema ? (
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f78f37]"></div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                          {/* Inspection Score */}
                          <div className="mb-6 sm:mb-8">
                            <div className="flex justify-between items-center mb-4 gap-2">
                              <h4 className="font-semibold text-gray-700 text-sm sm:text-base">{lang[language].overallCondition}</h4>
                              <div className="bg-gradient-to-r from-[#f78f37] to-[#ffac5f] text-white font-bold px-3 py-1 rounded-full text-xs sm:text-sm">
                                {lang[language].excellent}
                              </div>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-gradient-to-r from-[#f78f37] to-[#ffac5f] h-2.5 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>{lang[language].fair}</span>
                              <span>{lang[language].excellent}</span>
                            </div>
                          </div>
                          
                          {/* Key Inspection Points */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                              <div className="flex items-center mb-2">
                                <Wrench className="h-5 w-5 text-[#f78f37] mr-2" />
                                <h5 className="font-semibold text-gray-700">{lang[language].mechanical}</h5>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{lang[language].condition}</span>
                                <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                  {lang[language].excellent}
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                              <div className="flex items-center mb-2">
                                <Car className="h-5 w-5 text-[#f78f37] mr-2" />
                                <h5 className="font-semibold text-gray-700">{lang[language].exterior}</h5>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{lang[language].condition}</span>
                                <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                  {lang[language].veryGood}
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                              <div className="flex items-center mb-2">
                                <Star className="h-5 w-5 text-[#f78f37] mr-2" />
                                <h5 className="font-semibold text-gray-700">{lang[language].interior}</h5>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{lang[language].condition}</span>
                                <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                  {lang[language].excellent}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Detailed Inspection Information - Collapsible Sections */}
                          <div className="border-t border-gray-200 pt-4 sm:pt-6">
                            <h4 className="font-semibold text-gray-700 mb-4 text-sm sm:text-base">{lang[language].detailedInspectionReport}</h4>
                            
                            <div className="space-y-3">
                              {inspectionDetails && inspectionSchema && (
                                <>
                                  {/* Check if new format with sections containing label and fields */}
                                  {Object.keys(inspectionSchema).map((sectionKey, sectionIndex) => {
                                    const section = inspectionSchema[sectionKey];
                                    
                                    // Skip non-section keys like extraData
                                    if (sectionKey === 'extraData' || !section || typeof section !== 'object') return null;
                                    
                                    // Handle new format: { label: "Section Name", fields: [{label, value}] }
                                    if (section.label && section.fields && Array.isArray(section.fields)) {
                                      const isExpanded = expandedSections[sectionKey] ?? (sectionIndex === 0);
                                      
                                      return (
                                        <div key={sectionKey} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                          {/* Section Header - Clickable */}
                                          <button
                                            onClick={() => toggleSection(sectionKey)}
                                            className="w-full flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors gap-2"
                                          >
                                            <div className="flex items-center min-w-0">
                                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#f78f37] to-[#ffac5f] flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                                <span className="text-white text-xs sm:text-sm font-bold">{sectionIndex + 1}</span>
                                              </div>
                                              <h5 className="font-semibold text-gray-800 text-left text-sm sm:text-base truncate">{section.label}</h5>
                                            </div>
                                            <ChevronDown
                                              className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                                            />
                                          </button>

                                          {/* Section Fields - Collapsible */}
                                          <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                            <div className="p-3 sm:p-4 pt-0 border-t border-gray-100">
                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3">
                                                {section.fields.map((field: any, fieldIndex: number) => (
                                                  <div
                                                    key={fieldIndex}
                                                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 px-2 sm:px-3 bg-gray-50 rounded-lg gap-1 sm:gap-2"
                                                  >
                                                    <span className="text-xs sm:text-sm text-gray-600">{field.label}</span>
                                                    <span className="text-xs sm:text-sm font-medium text-gray-900 flex items-center gap-1 flex-shrink-0">{field.value || 'N/A'}
                                                    {field.value == 'Pass' ? <CheckCircle2Icon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : field.value == 'Fail' ||  field.value == 'Damaged' ||  field.value == 'Leak' ? <InfoCircledIcon className="h-3 w-3 sm:h-4 sm:w-4 text-[#E1AD01]" /> : null}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                    
                                    // Handle old format: direct key-value pairs
                                    if (sectionKey !== 'overview') {
                                      return (
                                        <div key={sectionKey + sectionIndex} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                          <h5 className="font-semibold text-gray-700 mb-2">{sectionKey.replace(/_/g, " ")}</h5>
                                          <div className="text-sm flex items-center">
                                            {typeof section === 'object' && section?.length ? (
                                              <span>{section[0].value}</span>
                                            ) : typeof section === 'object' && !section?.length ? (
                                              <span>{section?.value || 'N/A'}</span>
                                            ) : (
                                              <span>{section === "" ? "N/A" : section}</span>
                                            )}
                                            
                                            {extraData && extraData[sectionKey] && (
                                              <Popover>
                                                <PopoverTrigger>
                                                  <Info className="h-4 w-4 ml-2 text-blue-500 cursor-pointer" />
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80 p-0 bg-white">
                                                  <div className="p-4">
                                                    <h5 className="font-medium text-gray-900 mb-2">{sectionKey.replace(/_/g, " ")} {lang[language].details}</h5>
                                                    {extraData[sectionKey].image && (
                                                      <div className="mb-3">
                                                        <img 
                                                          src={extraData[sectionKey].image} 
                                                          alt={sectionKey.replace(/_/g, " ")} 
                                                          className="w-full h-auto rounded-md"
                                                        />
                                                      </div>
                                                    )}
                                                    {extraData[sectionKey].comment && (
                                                      <p className="text-sm text-gray-700">
                                                        <span className="font-medium">{lang[language].comment}</span> {extraData[sectionKey].comment}
                                                      </p>
                                                    )}
                                                  </div>
                                                </PopoverContent>
                                              </Popover>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    }
                                    
                                    return null;
                                  })}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Car Body Condition */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <Car className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].carBodyCondition}</span>
                      </h3>

                      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                        {inspectionDetails?.carBodyConditionJson ? (
                          <CarBodySvgView data={inspectionDetails?.carBodyConditionJson}/>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500">{lang[language].carBodyConditionDetailsNotAvailable}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Inspection Images */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].inspectionImages}</span>
                      </h3>
                      
                      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                        {images?.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                            {images.map((img: any, index: number) => (
                              <div key={index} className="bg-white p-1 sm:p-2 rounded-lg shadow-sm border border-gray-200">
                                <img
                                  src={img}
                                  alt={`Inspection image ${index + 1}`}
                                  className="w-full h-20 sm:h-32 object-cover rounded-md mb-1 sm:mb-2"
                                />
                                <p className="text-xs text-gray-500 text-center truncate">
                                  {img.caption || `Image ${index + 1}`}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500">{lang[language].noInspectionImagesAvailable}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Findings / Other Inspection Images */}
                    {inspectionImages && (inspectionImages as any[]).length > 0 && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                          <Info className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].findings || 'Findings'}</span>
                        </h3>
                        
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                            {(inspectionImages as any[]).map((img: any, index: number) => (
                              <div key={index} className="bg-white p-1 sm:p-2 rounded-lg shadow-sm border border-gray-200">
                                <img
                                  src={img.url || img.imageUrl || img}
                                  alt={img.caption || `Finding ${index + 1}`}
                                  className="w-full h-20 sm:h-32 object-cover rounded-md mb-1 sm:mb-2"
                                />
                                <p className="text-xs text-gray-600 text-center truncate font-medium">
                                  {img.caption.toString().split('_').join(' ') || `Finding ${index + 1}`}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Inspection Certificate */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37] flex-shrink-0" /> <span>{lang[language].inspectionCertificate}</span>
                      </h3>

                      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg text-center">
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
                          <Shield className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-[#f78f37] mb-4" />
                          <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{lang[language].certifiedPreOwnedTitle}</h4>
                          <p className="text-xs sm:text-sm text-gray-600 mb-4">{lang[language].certifiedPreOwned}</p>
                          <div className="flex flex-wrap justify-center gap-2 mb-4">
                            <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              {lang[language].mechanical} ✓
                            </div>
                            <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              {lang[language].electrical} ✓
                            </div>
                            <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            {lang[language].safety} ✓
                            </div>
                          </div>
                          <button
                          onClick={()=>{
                            const carDetails = `${car?.modelYear} ${car?.make} ${car?.model}`;
                            const message = `Hello, I'm interested for ${carDetails} inspection report`;
                           window.location.href = `whatsapp://send?phone=+966920032590&text=${encodeURIComponent(message)}`;
                          }}
                          className="text-[#f78f37] hover:text-[#e67d26] font-medium text-sm">
                            {lang[language].downloadCertificate}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
            
              
              
              </div>
            </div>
          </div>

          {/* Right Column - Contact and Actions */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-1">
            {/* Price and Actions */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-6 lg:sticky lg:top-20 z-20">
              <div className="pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-gray-200">
                <div className="text-xs sm:text-sm text-gray-500 mb-1">{lang[language].cashPrice}</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  SAR {numberWithCommas(car?.sellingPrice || car?.bookValue)}
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-gray-200">
                <button
                  onClick={() => {
                    const carDetails = `${car?.modelYear} ${car?.make} ${car?.model}`;
                    const carPrice = `SAR ${numberWithCommas(car?.sellingPrice || car?.bookValue)}`;
                    const currentUrl = window.location.href;
                    const message = `Hello, I'm interested in the ${carDetails} (${carPrice}) that I found on your website. Can I schedule a test drive? Here's the car link: ${currentUrl}`;
                    window.location.href = `whatsapp://send?phone=+966920032590&text=${encodeURIComponent(message)}`;
                  }}
                  className="w-full bg-[#f78f37] hover:bg-[#e67d26] text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition text-sm sm:text-base cursor-pointer"
                >
                  {lang[language].interested}
                </button>
                <button
                  onClick={() => {
                    const carDetails = `${car?.modelYear} ${car?.make} ${car?.model}`;
                    const carPrice = `SAR ${numberWithCommas(car?.sellingPrice || car?.bookValue)}`;
                    const currentUrl = window.location.href;
                    const message = `Hello, I'd like to reserve the ${carDetails} (${carPrice}) that I found on your website. Here's the car link: ${currentUrl}`;
                    window.location.href = `whatsapp://send?phone=+966920032590&text=${encodeURIComponent(message)}`;
                  }}
                  className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition text-sm sm:text-base cursor-pointer"
                >
                  {lang[language].reserveCar}
                </button>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <button
                  onClick={() => {
                    const carDetails = `${car?.modelYear} ${car?.make} ${car?.model}`;
                    const currentUrl = window.location.href;
                    const message = `Hello, I have a question about the ${carDetails} that I found on your website. Here's the car link: ${currentUrl}`;
                    window.location.href = `whatsapp://send?phone=+966920032590&text=${encodeURIComponent(message)}`;
                  }}
                  className="w-full flex items-start gap-3 text-left group cursor-pointer"
                >
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm sm:text-base text-gray-900">{lang[language].connectWhatsappTitle}</div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{lang[language].connectWhatsappSubtitle}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 mt-2 group-hover:text-gray-600 transition" />
                </button>

                <button
                  onClick={() => {
                    window.location.href = `tel:+966920032590`;
                  }}
                  className="w-full flex items-start gap-3 text-left group cursor-pointer"
                >
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[#f78f37]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm sm:text-base text-gray-900">{lang[language].talkDirectlyTitle}</div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{lang[language].talkDirectlySubtitle}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 mt-2 group-hover:text-gray-600 transition" />
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-medium mb-4">{lang[language].sellerInfo}</h3>
              <div className="flex items-center mb-4">
                {isCertifiedSeller ? (
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-3 flex-shrink-0 overflow-hidden">
                    <img src="/logo.png" alt="Baddelha" className="h-7 w-7 sm:h-8 sm:w-8 object-contain" />
                  </div>
                ) : (
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-50 flex items-center justify-center text-[#f78f37] mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div>
                  <div className="font-medium text-sm sm:text-base">{car?.seller?.name || lang[language].defaultSellerName}</div>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-700 mb-4">
                <div className="flex items-center mb-1">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-400 flex-shrink-0" />
                  {car?.location || lang[language].defaultLocation}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Cars */}
        {similarCars?.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h3 className="text-base sm:text-lg font-medium mb-4">{lang[language].similarCars}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {similarCars?.map((car: any) => {
                return <VehicleCard
                  key={car?.id}
                  car={car}
                  lang={lang}
                  language={language} />
              })}
            </div>

            <div className="mt-6 text-center">
              <button className="bg-white hover:bg-orange-50 text-[#f78f37] font-medium py-2 px-4 sm:px-6 rounded-lg border border-[#f78f37] transition inline-flex items-center text-xs sm:text-sm">
                {lang[language].viewMoreSimilarCars} <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    <LoginModal
      open={showLoginModal}
      onOpenChange={setShowLoginModal}
      onSuccess={() => setIsAuthenticated(true)}
    />
    </>
  );
};

