'use client';
import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import Select from 'react-select';
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
            <Select
              instanceId="make-select"
              inputId="make"
              value={makeId ? { value: makeId, label: make } : null}
              onChange={(option) => {
                setMake(option?.label || '');
                setMakeId(option?.value || '');
              }}
              options={makes?.map(makeItem => ({ value: makeItem.id, label: makeItem.name }))}
              placeholder={lang[languageContent].selectMake}
              isLoading={loading.makes}
              isDisabled={loading.makes}
              isClearable
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
              classNames={{
                control: () => 'rounded-lg border-gray-300 bg-gray-50 py-1 px-1',
                menu: () => 'rounded-lg shadow-lg',
              }}
              styles={{
                control: (base) => ({ ...base, minHeight: '48px' }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
            {error.makes && (
              <p className="mt-1 text-sm text-red-600">{error.makes}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">{lang[languageContent].model}</label>
            <Select
              instanceId="model-select"
              inputId="model"
              value={modelId ? { value: modelId, label: model } : null}
              onChange={(option) => {
                setModel(option?.label || '');
                setModelId(option?.value || '');
              }}
              options={models.map(modelItem => ({ value: modelItem.id, label: modelItem.name }))}
              placeholder={lang[languageContent].selectModel}
              isLoading={loading.models}
              isDisabled={loading.models || !make}
              isClearable
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
              classNames={{
                control: () => 'rounded-lg border-gray-300 bg-gray-50 py-1 px-1',
                menu: () => 'rounded-lg shadow-lg',
              }}
              styles={{
                control: (base) => ({ ...base, minHeight: '48px' }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
            {error.models && (
              <p className="mt-1 text-sm text-red-600">{error.models}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <Select
              instanceId="year-select"
              inputId="year"
              value={year ? { value: year, label: year } : null}
              onChange={(option) => setYear(option?.value || '')}
              options={years.map(y => ({ value: y, label: y }))}
              placeholder={lang[languageContent].selectYear}
              isClearable
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
              classNames={{
                control: () => 'rounded-lg border-gray-300 bg-gray-50 py-1 px-1',
                menu: () => 'rounded-lg shadow-lg',
              }}
              styles={{
                control: (base) => ({ ...base, minHeight: '48px' }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
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

export default ValuationWidget;