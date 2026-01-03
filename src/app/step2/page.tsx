'use client';
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import { useLanguage } from '../../contexts/LanguageContext';
import lang  from '../../locale';
import { useRouter } from 'next/navigation';
import useStateRef from 'react-usestateref';

const Step2 = () => {
    const [bodyType, setBodyType] = useState('');
    const [bodyTypeName, setBodyTypeName] = useState('');
    const [engineSize, setEngineSize] = useState('');
    const [engineSizeName, setEngineSizeName] = useState('');
    const [mileage, setMileage] = useState('');
    const [mileageName, setMileageName] = useState('');
    const [option, setOption] = useState('Basic');
    const [paint, setPaint] = useState('Original paint');
    const [gccSpecs, setGccSpecs] = useState('GCC Specs');

    const { language } = useLanguage();
    const languageContent = language === 'ar' ? 'ar' : 'en';
    const router = useRouter();

    
    
    // State for car details from Step1
    const [carDetails, setCarDetails] = useState<{ make: string; model: string; year: string }>({ make: '', model: '', year: '' });
    
    // State for API data
    const [bodyTypes, setBodyTypes,bodyTypesRef] = useStateRef<{id: string; name: string}[]>([]);
    const [engineSizes, setEngineSizes,engineSizesRef] = useStateRef<{id: string; name: string}[]>([]);
    const [mileageOptions, setMileageOptions] = useState<{id: string; name: string, label: string}[]>([]);
    
    // Loading states
    const [loading, setLoading] = useState({
        bodyTypes: false,
        engineSizes: false,
        mileage: false
    });
    
    // Error states
    const [error, setError] = useState({
        bodyTypes: '',
        engineSizes: '',
        mileage: ''
    });
    
    // Load car details from sessionStorage
    useEffect(() => {
        const storedCarDetails = sessionStorage.getItem('carDetails');
        if (storedCarDetails) {
            console.log('Stored car details:', storedCarDetails);
            setCarDetails(JSON.parse(storedCarDetails));
        }
    }, []);

    const getCarSpecs = () => {
        const storedCarDetails: any = sessionStorage.getItem('carDetails');
        const _carDetails = JSON.parse(storedCarDetails);
        axiosInstance.post(`/api/1.0/car/specs`,{
            make: _carDetails.make,
            model: _carDetails.model,
            year: Number(_carDetails.year)
        })
            .then((response) => {
                console.log('Car specs:', response.data);
           const data = response.data;

        if(engineSizesRef?.current?.length > 0 && bodyTypesRef?.current?.length > 0 ){
                const newBodyType: any [] = []
                const newEngineSize: any [] = []
                
                data.bodyTypes.map((item: any) => {
                    bodyTypesRef?.current.map((bodyType: any) => {
                        if(bodyType.name === item){
                            newBodyType.push(bodyType)
                        }
                    })
                });

                data.engineSizes.map((item: any) => {
                    engineSizesRef?.current.map((engineSize: any) => {
                        if(engineSize.name === item){
                            newEngineSize.push(engineSize)
                        }
                    })
                });

                console.log(newBodyType,newEngineSize);

                if(newBodyType.length > 0){
                    setBodyTypes(newBodyType);
                    setBodyType(newBodyType[0].name);
                    setBodyTypeName(newBodyType[0].name);
                }
                if(newEngineSize.length > 0){
                    setEngineSizes(newEngineSize);
                    setEngineSize(newEngineSize[0].name);
                    setEngineSizeName(newEngineSize[0].name);
                }
        }

            })
            .catch((error) => {
                console.error('Error fetching car specs:', error);
            });
  
           



  

    }
    
    // Fetch body types
    useEffect(() => {
        const fetchBodyTypes = async () => {
            setLoading(prev => ({ ...prev, bodyTypes: true }));
            setError(prev => ({ ...prev, bodyTypes: '' }));
            
            try {
                const response = await axiosInstance.get('/api/1.0/car-options/body-types');
                setBodyTypes(response?.data || []);
                if (response?.data?.length > 0) {
                    setBodyType(response?.data[0].id);
                    setBodyTypeName(response?.data[0].name);
                }

                fetchEngineSizes();
            } catch (err) {
                console.error('Error fetching body types:', err);
                setError(prev => ({ ...prev, bodyTypes: 'Failed to load body types' }));
            } finally {
                setLoading(prev => ({ ...prev, bodyTypes: false }));
            }
        };
        
        fetchBodyTypes();
    }, []);
    
  
    const fetchEngineSizes = async () => {
        setLoading(prev => ({ ...prev, engineSizes: true }));
        setError(prev => ({ ...prev, engineSizes: '' }));
        
        try {
            const response = await axiosInstance.get('/api/1.0/car-options/engine-size');
            setEngineSizes(response?.data || []);
            if (response?.data?.length > 0) {
                setEngineSize(response?.data[0].id);
                setEngineSizeName(response?.data[0].name);
            }

            getCarSpecs();

        } catch (err) {
            console.error('Error fetching engine sizes:', err);
            setError(prev => ({ ...prev, engineSizes: 'Failed to load engine sizes' }));
        } finally {
            setLoading(prev => ({ ...prev, engineSizes: false }));
        }
    };

    // Fetch mileage options
    useEffect(() => {
        const fetchMileageOptions = async () => {
            setLoading(prev => ({ ...prev, mileage: true }));
            setError(prev => ({ ...prev, mileage: '' }));
            
            try {
                const response = await axiosInstance.get('/api/1.0/car-options/car-mileage');
                setMileageOptions(response?.data || []);
                if (response?.data?.length > 0) {
                    setMileage(response?.data[0].id);
                    setMileageName(response?.data[0].label || response?.data[0].name);
                }
            } catch (err) {
                console.error('Error fetching mileage options:', err);
                setError(prev => ({ ...prev, mileage: 'Failed to load mileage options' }));
            } finally {
                setLoading(prev => ({ ...prev, mileage: false }));
            }
        };
        
        fetchMileageOptions();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Process form data and handle completion
        console.log('Form submitted with:', { bodyType, engineSize, mileage, option, paint, gccSpecs });
        
        // Save form data to sessionStorage
        const step2Data = {
            bodyType,
            engineSize,
            mileage,
            option,
            paint,
            gccSpecs,
            bodyTypeName,
            engineSizeName,
            mileageName
        };
        sessionStorage.setItem('step2Data', JSON.stringify(step2Data));
        
        // Navigate to the next step
        router.push('/step3');
    };
    

    const currentStep = 2;
const totalSteps = 3;
const progressPercent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));
const progressSteps = [
    { key: 'select', label: lang[languageContent].select, state: currentStep > 1 ? 'done' : 'active' },
    { key: 'condition', label: lang[languageContent].condition, state: currentStep === 2 ? 'active' : currentStep > 2 ? 'done' : 'upcoming' },
    { key: 'book', label: lang[languageContent].book, state: currentStep >= 3 ? 'active' : 'upcoming' },
];

    return (
        <div className="max-w-6xl mt-[120px] mx-auto px-4 py-8">
            {/* Progress Indicator */}
            <div className="mb-8">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4">
    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <span className="font-semibold text-gray-800">Step {currentStep} / {totalSteps}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600">In progress</span>
    </div>
    <div className="relative">
        <div className="absolute top-6 left-3 right-3 h-2 rounded-full bg-gray-200 overflow-hidden">
            <div style={{ width: `${progressPercent}%` }} className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-300 shadow-[0_8px_20px_-10px_rgba(245,158,11,0.9)]" />
        </div>
        <div className="relative flex justify-between">
            {progressSteps.map((step, idx) => {
                const isDone = step.state === 'done';
                const isActive = step.state === 'active';
                return (
                    <div key={step.key} className="flex flex-col items-center gap-1 w-1/3 text-center">
                        <div className={`h-11 w-11 rounded-full border-2 flex items-center justify-center transition-all ${isDone ? 'bg-gradient-to-r from-amber-500 to-amber-400 border-amber-300 shadow-md' : isActive ? 'bg-white border-amber-400 ring-4 ring-amber-100' : 'bg-white border-gray-200'}`}>
                            {isDone ? <Check className="h-5 w-5 text-white" /> : <span className={`text-sm font-semibold ${isActive ? 'text-amber-600' : 'text-gray-400'}`}>{idx + 1}</span>}
                        </div>
                        <span className={`text-sm font-semibold ${isActive ? 'text-gray-900' : isDone ? 'text-gray-700' : 'text-gray-500'}`}>{step.label}</span>
                        <span className="text-[11px] text-gray-500">{isDone ? 'Completed' : isActive ? 'Currently filling' : 'Up next'}</span>
                    </div>
                );
            })}
        </div>
    </div>
</div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Car Header Banner */}
                <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 px-6 py-5">
                    <p className="text-slate-400 text-sm mb-1">{language === "en" ? "Your Vehicle" : "سيارتك"}</p>
                    <h2 className="text-xl md:text-2xl font-bold text-white">{carDetails.make} {carDetails.model} {carDetails.year}</h2>
                    <p className="text-slate-300 text-sm mt-1">{lang[languageContent].enterInformation}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4 md:p-6">
                    {/* Dropdowns Section */}
                    <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Body Type */}
                            <div className="bg-slate-50 rounded-xl p-4">
                                <label className="block text-xs font-medium text-slate-500 mb-2">{lang[languageContent].bodyType}</label>
                                <div className="relative">
                                    <select
                                        value={bodyType}
                                        onChange={(e) => {
                                            setBodyType(e.target.value)
                                            setBodyTypeName(bodyTypes.find(type => type.id == e.target.value)?.name || '')
                                        }}
                                        className="block w-full rounded-xl border-0 bg-white py-3 px-4 pr-10 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-slate-900 appearance-none font-medium text-gray-900"
                                        disabled={loading.bodyTypes}
                                    >
                                        {loading.bodyTypes ? (
                                            <option>Loading...</option>
                                        ) : bodyTypes.length > 0 ? (
                                            bodyTypes.map((type) => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))
                                        ) : (
                                            <option value="">No body types available</option>
                                        )}
                                    </select>
                                    <div className={`pointer-events-none absolute inset-y-0 ${language == "en" ? "right-0" : "left-0"} flex items-center px-3 text-slate-400`}>
                                        {loading.bodyTypes ? (
                                            <span className="animate-spin h-4 w-4 border-2 border-slate-400 rounded-full border-t-transparent"></span>
                                        ) : (
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    {bodyType && !loading.bodyTypes && (
                                        <div className={`absolute ${language == "en" ? "right-8" : "left-8"} top-0 h-full flex items-center`}>
                                            <Check className="h-4 w-4 text-green-500" />
                                        </div>
                                    )}
                                </div>
                                {error.bodyTypes && (
                                    <p className="mt-2 text-xs text-red-600">{error.bodyTypes}</p>
                                )}
                            </div>
                            
                            {/* Engine */}
                            <div className="bg-slate-50 rounded-xl p-4">
                                <label className="block text-xs font-medium text-slate-500 mb-2">{lang[languageContent].engineSize}</label>
                                <div className="relative">
                                    <select
                                        value={engineSize}
                                        onChange={(e) => {
                                            setEngineSize(e.target.value)
                                            setEngineSizeName(engineSizes.find(engine => engine.id == e.target.value)?.name || '')
                                        }}
                                        className="block w-full rounded-xl border-0 bg-white py-3 px-4 pr-10 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-slate-900 appearance-none font-medium text-gray-900"
                                        disabled={loading.engineSizes}
                                    >
                                        {loading.engineSizes ? (
                                            <option>Loading...</option>
                                        ) : engineSizes.length > 0 ? (
                                            engineSizes.map(engine => (
                                                <option key={engine.id} value={engine.id}>{engine.name}</option>
                                            ))
                                        ) : (
                                            <option value="">No engine sizes available</option>
                                        )}
                                    </select>
                                    <div className={`pointer-events-none absolute inset-y-0 ${language == "en" ? "right-0" : "left-0"} flex items-center px-3 text-slate-400`}>
                                        {loading.engineSizes ? (
                                            <span className="animate-spin h-4 w-4 border-2 border-slate-400 rounded-full border-t-transparent"></span>
                                        ) : (
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    {engineSize && !loading.engineSizes && (
                                        <div className={`absolute ${language == "en" ? "right-8" : "left-8"} top-0 h-full flex items-center`}>
                                            <Check className="h-4 w-4 text-green-500" />
                                        </div>
                                    )}
                                </div>
                                {error.engineSizes && (
                                    <p className="mt-2 text-xs text-red-600">{error.engineSizes}</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Mileage - Full Width */}
                        <div className="bg-slate-50 rounded-xl p-4">
                            <label className="block text-xs font-medium text-slate-500 mb-2">{lang[languageContent].mileage}</label>
                            <div className="relative">
                                <select
                                    value={mileage}
                                    onChange={(e: {target: {value: string}}) => {
                                        setMileage(e.target.value)
                                        setMileageName(mileageOptions.find(option => option.id == e.target.value)?.label || '')
                                    }}
                                    className="block w-full rounded-xl border-0 bg-white py-3 px-4 pr-10 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-slate-900 appearance-none font-medium text-gray-900"
                                    disabled={loading.mileage}
                                >
                                    {loading.mileage ? (
                                        <option>Loading...</option>
                                    ) : mileageOptions.length > 0 ? (
                                        mileageOptions.map(option => (
                                            <option key={option.id} value={option.id}>{option.label}</option>
                                        ))
                                    ) : (
                                        <option value="">No mileage options available</option>
                                    )}
                                </select>
                                <div className={`pointer-events-none absolute inset-y-0 ${language == "en" ? "right-0" : "left-0"} flex items-center px-3 text-slate-400`}>
                                    {loading.mileage ? (
                                        <span className="animate-spin h-4 w-4 border-2 border-slate-400 rounded-full border-t-transparent"></span>
                                    ) : (
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                {mileage && !loading.mileage && (
                                    <div className={`absolute ${language == "en" ? "right-8" : "left-8"} top-0 h-full flex items-center`}>
                                        <Check className="h-4 w-4 text-green-500" />
                                    </div>
                                )}
                            </div>
                            {error.mileage && (
                                <p className="mt-2 text-xs text-red-600">{error.mileage}</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Option Buttons */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">{lang[languageContent].option}</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button 
                                type="button" 
                                onClick={() => setOption('Basic')} 
                                className={`py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                                    option === 'Basic' 
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Basic
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setOption('Mid option')} 
                                className={`py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                                    option === 'Mid option' 
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Mid option
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setOption('Full option')} 
                                className={`py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                                    option === 'Full option' 
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Full option
                            </button>
                        </div>
                    </div>
                    
                    {/* Paint Buttons */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">{lang[languageContent].paint}</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button 
                                type="button" 
                                onClick={() => setPaint('Original paint')} 
                                className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                                    paint === 'Original paint' 
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Original
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setPaint('Partial repaint')} 
                                className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                                    paint === 'Partial repaint' 
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Partial
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setPaint('Total repaint')} 
                                className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                                    paint === 'Total repaint' 
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Total Repaint
                            </button>
                        </div>
                    </div>
                    
                    {/* GCC Specs Buttons */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">{lang[languageContent].gccSpecs}</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                type="button" 
                                onClick={() => setGccSpecs('GCC Specs')} 
                                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                                    gccSpecs === 'GCC Specs' 
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                GCC Specs
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setGccSpecs('Non GCC Specs')} 
                                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                                    gccSpecs === 'Non GCC Specs' 
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Non GCC Specs
                            </button>
                        </div>
                    </div>
                    
                    {/* Continue Button */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                        >
                            {lang[languageContent].continue}
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${language === 'ar' ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </form>
         
            </div>
        </div>
    );
};

export default Step2;
