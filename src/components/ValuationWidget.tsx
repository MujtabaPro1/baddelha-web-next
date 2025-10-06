import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';
import { useRouter } from 'next/navigation';
// Only keep the years array as static data
const years = Array.from({ length: 20 }, (_, i) => (new Date().getFullYear() - i).toString());

interface CarMake {
  id: string;
  name: string;
}

interface CarModel {
  id: string;
  name: string;
}

const ValuationWidget: React.FC = () => {
  const [makes, setMakes] = useState<CarMake[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState({
    makes: false,
    models: false
  });
  const [error, setError] = useState({
    makes: '',
    models: ''
  });
  
  const [make, setMake] = useState('');
  const [makeId, setMakeId] = useState('');
  const [model, setModel] = useState('');
  const [modelId, setModelId] = useState('');
  const [year, setYear] = useState('');
  const [isValid, setIsValid] = useState(true);
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const router = useRouter();
  
  // Fetch car makes on component mount
  useEffect(() => {
    const fetchCarMakes = async () => {
      setLoading(prev => ({ ...prev, makes: true }));
      setError(prev => ({ ...prev, makes: '' }));
      
      try {
        const response = await axiosInstance.get('/api/1.0/car-options/car-make');
        setMakes(response?.data?.data);
      } catch (err) {
        console.error('Error fetching car makes:', err);
        setError(prev => ({ ...prev, makes: 'Failed to load car makes' }));
      } finally {
        setLoading(prev => ({ ...prev, makes: false }));
      }
    };
    
    fetchCarMakes();
  }, []);
  
  // Fetch car models when make changes
  useEffect(() => {
    if (!makeId) {
      setModels([]);
      return;
    }
    
    const fetchCarModels = async () => {
      setLoading(prev => ({ ...prev, models: true }));
      setError(prev => ({ ...prev, models: '' }));
      setModel(''); // Reset model when make changes
      
      try {
        const response = await axiosInstance.get(`/api/1.0/car-options/car-model/${makeId}`);
        setModels(response?.data);
      } catch (err) {
        console.error('Error fetching car models:', err);
        setError(prev => ({ ...prev, models: 'Failed to load car models' }));
      } finally {
        setLoading(prev => ({ ...prev, models: false }));
      }
    };
    
    fetchCarModels();
  }, [makeId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !year) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    
    // Store the car details in localStorage or sessionStorage if needed
    const carDetails = { make, makeId, model, modelId, year };
    sessionStorage.setItem('carDetails', JSON.stringify(carDetails));
    
    // Redirect to Step2 page
    router.push('/step2');
  };
  
  return (
    <div  className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-4 text-white">
        <h2 className="text-xl font-semibold">{lang[languageContent].getYourCarsValue}</h2>
        <p className="text-blue-100 text-sm">{lang[languageContent].freeInstantAndAccurateValuation}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">{lang[languageContent].make}</label>
            <div className="relative">
              <select
                id="make"
                
                value={makeId}
                onChange={(e) => {
                  console.log(e.target.options[e.target.selectedIndex].text)
                  setMake(e.target.options[e.target.selectedIndex].text);
                  setMakeId(e.target.value);
                }}
                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 pr-8 focus:border-blue-500 focus:ring-blue-500 appearance-none"
                disabled={loading.makes}
              >
                <option value="">{lang[languageContent].selectMake}</option>
                {makes?.map(makeItem => (
                  <option key={makeItem.id} value={makeItem.id}>{makeItem.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                {loading.makes ? (
                  <span className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></span>
                ) : (
                  <ChevronIcon />
                )}
              </div>
            </div>
            {error.makes && (
              <p className="mt-1 text-sm text-red-600">{error.makes}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">{lang[languageContent].model}</label>
            <div className="relative">
              <select
                id="model"
                value={modelId}
                onChange={(e) => {
                  setModel(e.target.options[e.target.selectedIndex].text);
                  setModelId(e.target.value);
                }}
                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 pr-8 focus:border-blue-500 focus:ring-blue-500"
                disabled={loading.models || !make}
              >
                <option value="">{lang[languageContent].selectModel}</option>
                {models.map(modelItem => (
                  <option key={modelItem.id} value={modelItem.id}>{modelItem.name}</option>
                ))}
              </select>
              {loading.models && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <span className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></span>
                </div>
              )}
            </div>
            {error.models && (
              <p className="mt-1 text-sm text-red-600">{error.models}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <div className="relative">
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 pr-8 focus:border-blue-500 focus:ring-blue-500 appearance-none"
              >
                <option value="">{lang[languageContent].selectYear}</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronIcon />
              </div>
            </div>
          </div>
          
         
        </div>
        
        {!isValid && (
          <div className="flex items-start mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{lang[languageContent].fillAllFields}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="hidden md:flex items-center text-gray-600 text-sm">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            <span>{lang[languageContent].bankApprovedValuation}</span>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 shadow-md flex items-center justify-center"
          >
            {lang[languageContent].getValuation} {language == 'en' ? <ArrowRight className="ml-2 h-5 w-5" /> : <ArrowLeft className="ml-2 h-5 w-5" />}
          </button>
        </div>
      </form>
      
      <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-y-2 border-t border-gray-100">
        <div className="flex items-center">
          <Check className="h-4 w-4 text-green-500 mr-2" />
          <span className="text-sm text-gray-600">{lang[languageContent].free}</span>
        </div>
        <div className="flex items-center">
          <Check className="h-4 w-4 text-green-500 mr-2" />
          <span className="text-sm text-gray-600">{lang[languageContent].noObligations}</span>
        </div>
        <div className="flex items-center">
          <Check className="h-4 w-4 text-green-500 mr-2" />
          <span className="text-sm text-gray-600">{lang[languageContent].instantResults}</span>
        </div>
        <div className="flex items-center">
          <Check className="h-4 w-4 text-green-500 mr-2" />
          <span className="text-sm text-gray-600">{lang[languageContent].tradeInOptions}</span>
        </div>
      </div>
    </div>
  );
};

const ChevronIcon = () => (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export default ValuationWidget;