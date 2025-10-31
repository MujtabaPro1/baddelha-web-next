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
                }
                if(newEngineSize.length > 0){
                    setEngineSizes(newEngineSize);
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
    
    return (
        <div className="max-w-5xl mt-[120px] mx-auto px-4 py-8">
            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="relative">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div style={{ width: '66%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-amber-500 to-amber-400"></div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-center">
                            <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                            </div>
                            <div className="mt-2 font-medium text-[#f78f37]">{lang[languageContent].select}</div>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-center">
                                <div className="h-3 w-3 bg-white rounded-full"></div>
                            </div>
                            <div className="mt-2 font-medium text-[#f78f37]">{lang[languageContent].condition}</div>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 mx-auto rounded-full bg-gray-300 flex items-center justify-center">
                                <div className="h-3 w-3 bg-white rounded-full"></div>
                            </div>
                            <div className="mt-2 font-medium text-gray-500">{lang[languageContent].book}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-[#3d3d40] px-6 py-4 text-white">
                    <h2 className="text-xl font-semibold">{carDetails.make} {carDetails.model} {carDetails.year}</h2>
                    <p className="text-blue-100 text-sm">{lang[languageContent].enterInformation}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Body Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{lang[languageContent].bodyType}</label>
                            <div className="relative">
                                <select
                                    value={bodyType}
                                    onChange={(e) => {
                                        setBodyType(e.target.value)
                                        setBodyTypeName(bodyTypes.find(type => type.id == e.target.value)?.name || '')
                                    }}
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 pr-8 focus:border-blue-500 focus:ring-blue-500 appearance-none"
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
                                <div className={`pointer-events-none absolute inset-y-0 ${language == "en" ? "right-0" : "left-0"} flex items-center px-2 text-gray-700`}>
                                    {loading.bodyTypes ? (
                                        <span className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></span>
                                    ) : (
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                {bodyType && !loading.bodyTypes && (
                                    <div className={`absolute ${language == "en" ? "right-0" : "left-10"} top-0 h-full flex items-center pr-10`}>
                                        <Check className="h-5 w-5 text-green-500" />
                                    </div>
                                )}
                            </div>
                            {error.bodyTypes && (
                                <p className="mt-1 text-sm text-red-600">{error.bodyTypes}</p>
                            )}
                        </div>
                        
                        {/* Engine */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{lang[languageContent].engineSize}</label>
                            <div className="relative">
                                <select
                                    value={engineSize}
                                    onChange={(e) => {
                                        setEngineSize(e.target.value)
                                        setEngineSizeName(engineSizes.find(engine => engine.id == e.target.value)?.name || '')
                                    }}
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 pr-8 focus:border-blue-500 focus:ring-blue-500 appearance-none"
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
                                <div className={`pointer-events-none absolute inset-y-0 ${language == "en" ? "right-0" : "left-0"} flex items-center px-2 text-gray-700`}>
                                    {loading.engineSizes ? (
                                        <span className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></span>
                                    ) : (
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                {engineSize && !loading.engineSizes && (
                                    <div className={`absolute ${language == "en" ? "right-0" : "left-10"} top-0 h-full flex items-center pr-10`}>
                                        <Check className="h-5 w-5 text-green-500" />
                                    </div>
                                )}
                            </div>
                            {error.engineSizes && (
                                <p className="mt-1 text-sm text-red-600">{error.engineSizes}</p>
                            )}
                        </div>
                        
                        {/* Mileage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{lang[languageContent].mileage}</label>
                            <div className="relative">
                                <select
                                    value={mileage}
                                    onChange={(e: {target: {value: string}}) => {
                                        setMileage(e.target.value)
                                        setMileageName(mileageOptions.find(option => option.id == e.target.value)?.label || '')
                                    }}
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 pr-8 focus:border-blue-500 focus:ring-blue-500 appearance-none"
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
                                <div className={`pointer-events-none absolute inset-y-0 ${language == "en" ? "right-0" : "left-0"} flex items-center px-2 text-gray-700`}>
                                    {loading.mileage ? (
                                        <span className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></span>
                                    ) : (
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                {mileage && !loading.mileage && (
                                    <div className={`absolute ${language == "en" ? "right-0" : "left-10"} top-0 h-full flex items-center pr-10`}>
                                        <Check className="h-5 w-5 text-green-500" />
                                    </div>
                                )}
                            </div>
                            {error.mileage && (
                                <p className="mt-1 text-sm text-red-600">{error.mileage}</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Option */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lang[languageContent].option}</label>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                type="button" 
                                onClick={() => setOption('Basic')} 
                                className={`px-4 py-2 rounded-md ${option === 'Basic' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Basic
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setOption('Mid option')} 
                                className={`px-4 py-2 rounded-md ${option === 'Mid option' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Mid option
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setOption('Full option')} 
                                className={`px-4 py-2 rounded-md ${option === 'Full option' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Full option
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setOption('I don\'t know')} 
                                className={`px-4 py-2 rounded-md ${option === 'I don\'t know' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                I don't know
                            </button>
                        </div>
                    </div>
                    
                    {/* Paint */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lang[languageContent].paint}</label>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                type="button" 
                                onClick={() => setPaint('Original paint')} 
                                className={`px-4 py-2 rounded-md ${paint === 'Original paint' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Original paint
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setPaint('Partial repaint')} 
                                className={`px-4 py-2 rounded-md ${paint === 'Partial repaint' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Partial repaint
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setPaint('Total repaint')} 
                                className={`px-4 py-2 rounded-md ${paint === 'Total repaint' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Total repaint
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setPaint('I don\'t know')} 
                                className={`px-4 py-2 rounded-md ${paint === 'I don\'t know' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                I don't know
                            </button>
                        </div>
                    </div>
                    
                    {/* GCC Specs */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lang[languageContent].gccSpecs}</label>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                type="button" 
                                onClick={() => setGccSpecs('GCC Specs')} 
                                className={`px-4 py-2 rounded-md ${gccSpecs === 'GCC Specs' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                GCC Specs
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setGccSpecs('Non GCC Specs')} 
                                className={`px-4 py-2 rounded-md ${gccSpecs === 'Non GCC Specs' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Non GCC Specs
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setGccSpecs('I don\'t know')} 
                                className={`px-4 py-2 rounded-md ${gccSpecs === 'I don\'t know' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                I don't know
                            </button>
                        </div>
                    </div>
                    
                    {/* Continue Button */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 shadow-md flex items-center justify-center"
                        >
                            {lang[languageContent].continue}
                        </button>
                    </div>
                </form>
                
                <div className="bg-gray-50 px-6 py-4 text-xs text-gray-500 border-t border-gray-100">
                    <p>{lang[languageContent].byContinuingYouAgreeToThe} <a href="#" className="text-blue-600 hover:underline">{lang[languageContent].termsAndConditions}</a> {lang[languageContent].and} <a href="#" className="text-blue-600 hover:underline">{lang[languageContent].privacyPolicy}</a></p>
                    <p className="mt-1">{lang[languageContent].thisSiteIsProtectedByReCaptchaAndTheGoogle} <a href="#" className="text-blue-600 hover:underline">{lang[languageContent].privacyPolicy}</a> {lang[languageContent].and} <a href="#" className="text-blue-600 hover:underline">{lang[languageContent].termsAndConditions}</a> {lang[languageContent].apply}.</p>
                </div>
            </div>
        </div>
    );
};

export default Step2;
