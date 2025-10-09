'use client';
import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
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
} from 'lucide-react';
import axiosInstance from '../../../../services/axiosInstance';
import { inspectionData, numberWithCommas } from '../../../../lib/utils';
import CarBodySvgView from '../../../../components/CarBodyView';
import { useParams } from 'next/navigation';

export default function Page() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'inspection'  | 'similar'>('overview');
  const [showContactForm, setShowContactForm] = useState(false);
  const [car, setCar] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [inspectionDetails, setInspectionDetails]: any = useState(null);
  const [inspectionSchema, setInspectionSchema]: any = useState(null);
  const params = useParams();
  // These state variables are initialized but not currently used
  // They are kept for future implementation of dynamic data loading



  const nextImage = () => {
    const imagesArray = images.length > 0 ? images : [];
    setCurrentImageIndex((prev) => (prev + 1) % imagesArray.length);
  };

  const prevImage = () => {
    const imagesArray = images.length > 0 ? images : [];
    setCurrentImageIndex((prev) => (prev - 1 + imagesArray.length) % imagesArray.length);
  };



   useEffect(()=>{
      // Extract car ID from URL
      const id = params?.id;
      
      if (id) {
         carDetails(id);
      }
   },[params?.id]);

   const carDetails = (id: any) => {
          axiosInstance.get('/api/1.0/car/car-details/' + id).then((res)=>{
              // Process car data
              const _car = res?.data?.car;
              const _inspectionData = inspectionData;
              
              // Process inspection data if available
              if(_car['Inspection']){
                  _car['InspectionData'] = _car?.Inspection?.[0]?.inspectionJson;
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

              setInspectionDetails(res?.data?.car?.Inspection?.[0]);
              setInspectionSchema(res?.data?.car?.Inspection?.[0]?.inspectionJson);
              
              // Process images
              if (res?.data?.images && res.data.images.length > 0) {
                  // Reorder images if needed
                  const imageUrls = res.data.images.map((img: any) => img.url || img.imageUrl || img);
                  setImages(imageUrls);
              } else if (_car.images && _car.images.length > 0) {
                  // Use car images if available
                  setImages(_car.images);
              }
              else if (res?.data?.carImages && res.data.carImages.length > 0) {
                  const imageUrls = res.data.carImages.map((img: any) => img.url || img.imageUrl || img);
                  setImages(imageUrls);
              }
              
              // Process car videos if available
              if (res?.data?.carImages) {
                  const videos = res.data.carImages.filter((i: any) => i.fileType && i.fileType.includes('video'));
                  if (videos.length > 0) {
                      // Handle videos if needed
                      console.log('Videos available:', videos.length);
                  }
              }
          }).catch((err)=>{
              console.log('err',err);
          })
      };


 
      if(!car || !inspectionDetails || !inspectionSchema){
        return <div>Loading...</div>
      }


  return (
    <div className="min-h-screen bg-white mt-[120px]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/buy" className="hover:text-red-500 transition">Cars for Sale</a>
            <ChevronRight className="h-4 w-4" />
            <a href="/buy" className="hover:text-red-500 transition">{car?.make}</a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{car?.model}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Slider */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="relative">
                <img
                  src={images.length > 0 ? images?.[currentImageIndex] : car?.images?.[currentImageIndex]}
                  alt={car ? `${car.year || ''} ${car.make || ''} ${car.model || ''}` : `${car?.year} ${car?.make} ${car?.model}`}
                  className="w-full h-96 object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length > 0 ? images.length : 0}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition"
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {(images.length > 0 ? images : []).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition ${
                        index === currentImageIndex ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Car Title and Basic Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {car ? `${car.year || ''} ${car.make || ''} ${car.model || ''}` : `${car?.year} ${car?.make} ${car?.model}`}
                  </h1>
                  <div className="flex items-center mt-2 text-gray-600">
                    <span className="flex items-center mr-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      {car?.location || 'Riyadh, Saudi Arabia'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-500">
                    SAR {numberWithCommas(car?.bookValue || 114210)}
                  </div>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="text-center border-r border-gray-200 last:border-r-0">
                  <div className="text-sm text-gray-500">Year</div>
                  <div className="font-semibold mt-1">{car?.year || '2022'}</div>
                </div>
                <div className="text-center border-r border-gray-200 last:border-r-0">
                  <div className="text-sm text-gray-500">Mileage</div>
                  <div className="font-semibold mt-1">{car?.mileage ? car.mileage.toLocaleString() : '42,500'} km</div>
                </div>
                <div className="text-center border-r border-gray-200 last:border-r-0">
                  <div className="text-sm text-gray-500">Fuel Type</div>
                  <div className="font-semibold mt-1">{car?.fuelType || 'Petrol'}</div>
                </div>
                <div className="text-center border-r border-gray-200 last:border-r-0">
                  <div className="text-sm text-gray-500">Transmission</div>
                  <div className="font-semibold mt-1">{car?.transmission || 'Automatic'}</div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200">
                <nav className="flex px-4 overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'features', label: 'Features' },
                    { id: 'inspection', label: 'Inspection' },
                    { id: 'similar', label: 'Similar Cars' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      className={`py-4 px-4 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                        activeTab === id
                          ? 'border-amber-500 text-amber-500'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div>
                    {/* Specifications Table */}
                    <div className="overflow-hidden">
                      <table className="min-w-full">
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500 w-1/2">Brand</td>
                            <td className="py-3 text-sm font-medium">{car?.make || 'Toyota'}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500">Model</td>
                            <td className="py-3 text-sm font-medium">{car?.model || 'RAV4'}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500">Year</td>
                            <td className="py-3 text-sm font-medium">{car?.year || '2022'}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500">Mileage</td>
                            <td className="py-3 text-sm font-medium">{car?.mileage ? car.mileage.toLocaleString() : '42,500'} km</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500">Fuel Type</td>
                            <td className="py-3 text-sm font-medium">{car?.fuelType || 'Petrol'}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500">Transmission</td>
                            <td className="py-3 text-sm font-medium">{car?.transmission || 'Automatic'}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500">Engine</td>
                            <td className="py-3 text-sm font-medium">{car?.engine || '2.5L 4-Cylinder'}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500">Drive Type</td>
                            <td className="py-3 text-sm font-medium">{car?.driveType || 'AWD'}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500">Exterior Color</td>
                            <td className="py-3 text-sm font-medium">{car?.exteriorColor || 'White'}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500">Interior Color</td>
                            <td className="py-3 text-sm font-medium">{car?.interiorColor || 'Black'}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500">Body Type</td>
                            <td className="py-3 text-sm font-medium">{car?.bodyType || 'SUV'}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500">Doors</td>
                            <td className="py-3 text-sm font-medium">{car?.doors || '5'}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500">Seats</td>
                            <td className="py-3 text-sm font-medium">{car?.seats || '5'}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-sm text-gray-500">VIN</td>
                            <td className="py-3 text-sm font-medium font-mono">{car?.vin || 'JTMWRREV7ND123456'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Features Tab */}
                {activeTab === 'features' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <Check className="h-5 w-5 mr-2 text-[#f78f37]" /> Key Features
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Comfort Features */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 text-gray-700 flex items-center">
                            <Star className="h-4 w-4 mr-2 text-[#f78f37]" /> Comfort
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
                              <li key={index} className="flex items-start">
                                <Check className="h-4 w-4 text-[#f78f37] mr-2 mt-0.5" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Technology Features */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 text-gray-700 flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-[#f78f37]" /> Technology
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
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 text-gray-700 flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-[#f78f37]" /> Safety
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
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 text-gray-700 flex items-center">
                            <Award className="h-4 w-4 mr-2 text-[#f78f37]" /> Performance
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
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 text-gray-700 flex items-center">
                            <Car className="h-4 w-4 mr-2 text-[#f78f37]" /> Exterior
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
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 text-gray-700 flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-2 text-[#f78f37]" /> Convenience
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
                      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <Plus className="h-5 w-5 mr-2 text-[#f78f37]" /> Additional Features
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 mb-4">
                          This vehicle comes with the following additional features and packages:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2 text-gray-700">Premium Package</h4>
                            <ul className="space-y-1">
                              {[
                                'Bang & Olufsen Sound System',
                                'Head-up Display',
                                'Ventilated Front Seats',
                                'Heated Rear Seats'
                              ].map((feature, index) => (
                                <li key={index} className="flex items-start">
                                  <Check className="h-4 w-4 text-[#f78f37] mr-2 mt-0.5" />
                                  <span className="text-sm text-gray-700">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-gray-700">Sport Package</h4>
                            <ul className="space-y-1">
                              {[
                                'Sport Seats',
                                'Sport Steering Wheel',
                                'Black Optic Package',
                                'Sport Suspension'
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
                    </div>
                  </div>
                )}

                {/* Inspection Tab */}
                {activeTab === 'inspection' && (
                  <div className="space-y-8">
                    {/* Inspection Summary */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-[#f78f37]" /> Inspection Summary
                      </h3>
                      
                      {!inspectionDetails?.inspectionJson ? (
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                          <p className="text-gray-500">No inspection report available for this car.</p>
                        </div>
                      ) : !inspectionSchema ? (
                        <div className="bg-gray-50 p-6 rounded-lg flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f78f37]"></div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-6 rounded-lg">
                          {/* Inspection Score */}
                          <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-semibold text-gray-700">Overall Condition</h4>
                              <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-white font-bold px-3 py-1 rounded-full">
                                Excellent
                              </div>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Poor</span>
                              <span>Excellent</span>
                            </div>
                          </div>
                          
                          {/* Key Inspection Points */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                              <div className="flex items-center mb-2">
                                <Wrench className="h-5 w-5 text-[#f78f37] mr-2" />
                                <h5 className="font-semibold text-gray-700">Mechanical</h5>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Condition</span>
                                <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                  Excellent
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                              <div className="flex items-center mb-2">
                                <Car className="h-5 w-5 text-[#f78f37] mr-2" />
                                <h5 className="font-semibold text-gray-700">Exterior</h5>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Condition</span>
                                <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                  Very Good
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                              <div className="flex items-center mb-2">
                                <Star className="h-5 w-5 text-[#f78f37] mr-2" />
                                <h5 className="font-semibold text-gray-700">Interior</h5>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Condition</span>
                                <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                  Excellent
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Detailed Inspection Information */}
                          <div className="border-t border-gray-200 pt-6">
                            <h4 className="font-semibold text-gray-700 mb-4">Detailed Inspection Report</h4>
                            
                            <div className="space-y-4">
                              {inspectionDetails && (
                                <div>
                                  {Object.keys(inspectionDetails?.inspectionJson).map((category, index) => {
                                    if(category === 'overview') return null;
                                    
                                    return (
                                      <div key={category + index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                                        <h5 className="font-semibold text-gray-700 mb-2">{category.replace(/_/g, " ")}</h5>
                                        <div className="text-sm">
                                          {typeof inspectionDetails?.inspectionJson[category] === 'object' && inspectionDetails?.inspectionJson[category]?.length ? (
                                            <span>{inspectionDetails?.inspectionJson[category][0].value}</span>
                                          ) : typeof inspectionDetails?.inspectionJson[category] === 'object' && !inspectionDetails?.inspectionJson[category]?.length ? (
                                            <span>{inspectionDetails?.inspectionJson[category]?.value || 'N/A'}</span>
                                          ) : (
                                            <span>{inspectionDetails?.inspectionJson[category] === "" ? "N/A" : inspectionDetails?.inspectionJson[category]}</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Car Body Condition */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <Car className="h-5 w-5 mr-2 text-[#f78f37]" /> Car Body Condition
                      </h3>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        {inspectionDetails?.carBodyConditionJson ? (
                          <CarBodySvgView data={inspectionDetails?.carBodyConditionJson}/>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500">Car body condition details not available.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Inspection Images */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-[#f78f37]" /> Inspection Images
                      </h3>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        {images?.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((img: any, index: number) => (
                              <div key={index} className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                                <img 
                                  src={img} 
                                  alt={`Inspection image ${index + 1}`} 
                                  className="w-full h-32 object-cover rounded-md mb-2" 
                                />
                                <p className="text-xs text-gray-500 text-center truncate">
                                  {img.caption || `Image ${index + 1}`}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No inspection images available.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Inspection Certificate */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-[#f78f37]" /> Inspection Certificate
                      </h3>
                      
                      <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
                          <Shield className="h-16 w-16 mx-auto text-[#f78f37] mb-4" />
                          <h4 className="text-xl font-bold text-gray-800 mb-2">Certified Pre-Owned</h4>
                          <p className="text-gray-600 mb-4">This vehicle has passed our rigorous 150-point inspection process.</p>
                          <div className="flex justify-center space-x-2 mb-4">
                            <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              Mechanical ✓
                            </div>
                            <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              Electrical ✓
                            </div>
                            <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              Safety ✓
                            </div>
                          </div>
                          <button className="text-[#f78f37] hover:text-[#e67d26] font-medium">
                            Download Certificate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
            
              
              
                {/* Similar Cars Tab */}
                {activeTab === 'similar' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Similar Cars</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Car 1 */}
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition">
                        <div className="relative">
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8l0IRdya6kunKn7-nw6HW0MjMVD34HaN8YQ&s" 
                            alt="Similar Car 1" 
                            className="w-full h-36 object-cover" />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-800 mb-1 truncate text-ellipsis text-sm">2021 Mercedes-Benz C-Class</h4>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-red-500 text-sm">SAR 129,900</span>
                            <span className="text-xs text-gray-500">38,200 km</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 mb-2">
                            <div className="flex items-center text-xs text-gray-600">
                              <Calendar className="h-3 w-3 mr-1" /> 2021
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Fuel className="h-3 w-3 mr-1" /> Petrol
                            </div>
                          </div>
                          <button className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs font-medium py-1 px-2 rounded transition">
                            View Details
                          </button>
                        </div>
                      </div>
                      
                      {/* Car 2 */}
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition">
                        <div className="relative">
                          <img src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                            alt="Similar Car 2" 
                            className="w-full h-36 object-cover" />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-800 mb-1 truncate text-ellipsis text-sm">2020 BMW 3 Series</h4>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-red-500 text-sm">SAR 119,500</span>
                            <span className="text-xs text-gray-500">45,600 km</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 mb-2">
                            <div className="flex items-center text-xs text-gray-600">
                              <Calendar className="h-3 w-3 mr-1" /> 2020
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Fuel className="h-3 w-3 mr-1" /> Petrol
                            </div>
                          </div>
                          <button className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs font-medium py-1 px-2 rounded transition">
                            View Details
                          </button>
                        </div>
                      </div>
                      
                      {/* Car 3 */}
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition">
                        <div className="relative">
                          <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                            alt="Similar Car 3" 
                            className="w-full h-36 object-cover" />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-800 mb-1 truncate text-ellipsis text-sm">2021 Audi A4</h4>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-red-500 text-sm">SAR 124,750</span>
                            <span className="text-xs text-gray-500">32,100 km</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 mb-2">
                            <div className="flex items-center text-xs text-gray-600">
                              <Calendar className="h-3 w-3 mr-1" /> 2021
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Fuel className="h-3 w-3 mr-1" /> Petrol
                            </div>
                          </div>
                          <button className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs font-medium py-1 px-2 rounded transition">
                            View Details
                          </button>
                        </div>
                      </div>
                      
                      {/* Car 4 */}
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition">
                        <div className="relative">
                          <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                            alt="Similar Car 4" 
                            className="w-full h-36 object-cover" />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-800 mb-1 truncate text-ellipsis text-sm">2022 Lexus ES</h4>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-red-500 text-sm">SAR 135,000</span>
                            <span className="text-xs text-gray-500">25,800 km</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 mb-2">
                            <div className="flex items-center text-xs text-gray-600">
                              <Calendar className="h-3 w-3 mr-1" /> 2022
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Fuel className="h-3 w-3 mr-1" /> Petrol
                            </div>
                          </div>
                          <button className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs font-medium py-1 px-2 rounded transition">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <button className="bg-white hover:bg-gray-50 text-red-500 font-medium py-2 px-6 rounded border border-red-500 transition inline-flex items-center text-sm">
                        View More Similar Cars <ArrowRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  </div>
                )}
                      
                      </div>
                    </div>
                  </div>
               
      
        

          {/* Right Column - Contact and Actions */}
          <div className="space-y-6">
            {/* Price and Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-2xl font-bold text-red-500 mb-1">
                  SAR {numberWithCommas(car?.bookValue || 114210)}
                </div>
                <div className="text-sm text-gray-500">
                  Price includes VAT
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = `/purchase/${car?.id || 1}`}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white font-medium py-3 px-6 rounded-lg transition"
                >
                  Buy Now
                </button>
                <button 
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
                <button 
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition"
                >
                  Contact Seller
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Seller Information</h3>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">{car?.seller?.name || 'Cars.ly Certified Dealer'}</div>
                  <div className="text-sm text-gray-500">Member since {car?.seller?.memberSince || 'Jan 2020'}</div>
                </div>
              </div>
              <div className="text-sm text-gray-700 mb-4">
                <div className="flex items-center mb-1">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {car?.location || 'Riyadh, Saudi Arabia'}
                </div>
              </div>
            </div>
          </div>
          </div></div>
        </div>
  );
};

