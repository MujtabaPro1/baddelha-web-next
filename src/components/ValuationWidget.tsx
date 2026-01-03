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
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{lang[languageContent].getYourCarsValue}</h2>
            <p className="text-slate-400 text-sm">{lang[languageContent].freeInstantAndAccurateValuation}</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* Make */}
          <div className="bg-slate-50 rounded-xl p-4">
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
          <div className="bg-slate-50 rounded-xl p-4">
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
          <div className="bg-slate-50 rounded-xl p-4">
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
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-3 w-3 text-green-600" />
            </div>
            <span>{lang[languageContent].bankApprovedValuation}</span>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
          >
            {lang[languageContent].getValuation}
            {language == 'en' ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
          </button>
        </div>
      </form>
      
      {/* Footer Benefits */}
      <div className="bg-slate-50 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="h-3 w-3 text-green-600" />
          </div>
          <span className="text-sm text-slate-600">{lang[languageContent].free}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="h-3 w-3 text-green-600" />
          </div>
          <span className="text-sm text-slate-600">{lang[languageContent].noObligations}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="h-3 w-3 text-green-600" />
          </div>
          <span className="text-sm text-slate-600">{lang[languageContent].instantResults}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="h-3 w-3 text-green-600" />
          </div>
          <span className="text-sm text-slate-600">{lang[languageContent].tradeInOptions}</span>
        </div>
      </div>
    </div>
  );
};

export default ValuationWidget;