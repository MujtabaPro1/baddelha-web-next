'use client';
import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle, ArrowLeft, Car } from 'lucide-react';
import Select, { components } from 'react-select';
import axiosInstance from '../services/axiosInstance';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';
import { useRouter } from 'next/navigation';
import { Card } from './ui/card';
// Only keep the years array as static data
const years = Array.from({ length: 20 }, (_, i) => (new Date().getFullYear() - i).toString());

// Car brand logo utility - using CarLogos.org API
const getCarLogo = (brandName: string): string => {
  //https://www.carlogos.org/car-logos/honda-logo.png
  const formattedName = brandName.toLowerCase().replace(/\s+/g, '-');
  return `https://www.carlogos.org/car-logos/${formattedName}-logo.png`;
};

// Custom Option component with logo
const CustomOption = (props: any) => {
  const [imgError, setImgError] = useState(false);
  
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-3">
        {!imgError ? (
          <img
            src={getCarLogo(props.data.label)}
            alt={props.data.label}
            className="w-6 h-6 object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded">
            <Car className="w-4 h-4 text-slate-400" />
          </div>
        )}
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );
};

// Custom SingleValue component with logo
const CustomSingleValue = (props: any) => {
  const [imgError, setImgError] = useState(false);
  
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-3">
        {!imgError ? (
          <img
            src={getCarLogo(props.data.label)}
            alt={props.data.label}
            className="w-5 h-5 object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded">
            <Car className="w-3 h-3 text-slate-400" />
          </div>
        )}
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );
};

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
   
  <Card className="mx-auto w-full border-primary max-w-4xl shadow-lg">

      <form onSubmit={handleSubmit} className="p-5 md:p-6">
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Make */}
          <div className="w-full">
            <label htmlFor="make" className="block text-xs font-medium text-slate-500 mb-2">{lang[languageContent].make}</label>
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
              components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
              classNames={{
                control: () => '!rounded-xl !border-0 !bg-white !shadow-none ring-1 ring-inset ring-slate-200 hover:ring-slate-300',
                menu: () => 'rounded-xl shadow-lg',
                placeholder: () => '!text-slate-400',
              }}
              styles={{
                control: (base) => ({ ...base, minHeight: '48px', padding: '2px 4px' }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
            {error.makes && (
              <p className="mt-2 text-xs text-red-600">{error.makes}</p>
            )}
          </div>
          
          {/* Model */}
          <div className="w-full">
            <label htmlFor="model" className="block text-xs font-medium text-slate-500 mb-2">{lang[languageContent].model}</label>
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
                control: () => '!rounded-xl !border-0 !bg-white !shadow-none ring-1 ring-inset ring-slate-200 hover:ring-slate-300',
                menu: () => 'rounded-xl shadow-lg',
                placeholder: () => '!text-slate-400',
              }}
              styles={{
                control: (base) => ({ ...base, minHeight: '48px', padding: '2px 4px' }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
            {error.models && (
              <p className="mt-2 text-xs text-red-600">{error.models}</p>
            )}
          </div>
          
          {/* Year */}
          <div className="w-full">
            <label htmlFor="year" className="block text-xs font-medium text-slate-500 mb-2">{lang[languageContent].year}</label>
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
                control: () => '!rounded-xl !border-0 !bg-white !shadow-none ring-1 ring-inset ring-slate-200 hover:ring-slate-300',
                menu: () => 'rounded-xl shadow-lg',
                placeholder: () => '!text-slate-400',
              }}
              styles={{
                control: (base) => ({ ...base, minHeight: '48px', padding: '2px 4px' }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>
        </div>
        
        {!isValid && (
          <div className="flex items-start mb-4 p-3 bg-red-50 text-red-700 rounded-xl">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{lang[languageContent].fillAllFields}</p>
          </div>
        )}
        
        <div className="flex flex-col w-full items-center justify-between gap-4">
          <button
            type="submit"
            className="w-full bg-primaryBtn text-white font-semibold py-3 px-8 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
          >
            {lang[languageContent].getValuation}
            {language == 'en' ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
          </button>
        </div>
      </form>
      
     </Card>

  );
};

export default ValuationWidget;