'use client'
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, ChevronRight, AlertCircle, CheckCircle, X, User, FileText, Car } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

interface Appointment {
  id: number;
  appointmentDate: string;
  appointmentTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCheckIn: boolean;
  status: string;
  location: string;
  notes: string;
  car?: {
    make: string;
    model: string;
    year: string;
    plateNumber: string;
  };
  Branch?: any;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get user email from localStorage
      const userDetails = localStorage.getItem('userDetails');
      if (!userDetails) {
        throw new Error('User details not found. Please login again.');
      }
      
      const { email } = JSON.parse(userDetails);
      if (!email) {
        throw new Error('Email not found in user details. Please login again.');
      }
      
      // Make API call with email as query parameter
      const response = await axiosInstance.get(`/api/1.0/book-appointment?search=${email}`);
      
      if (response.data && response.data.length > 0) {
        // Sort appointments by date (newest first)
        const sortedAppointments = response.data.sort((a: {
          appointmentDate: string;
        }, b: {
          appointmentDate: string;
        }) => 
          new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
        );
        
        // Process car details for all appointments
        const processedAppointments = sortedAppointments.map((apt: {carDetail: string}) => {
          const processedApt: {
            carDetail: string;
            car?: {
              make: string;
              model: string;
              year: string;
              plateNumber: string;
            };
          } = { ...apt };
          if (processedApt.carDetail) {
            try {
              processedApt.car = JSON.parse(processedApt.carDetail);
            } catch (e) {
              console.error('Error parsing car details:', e);
            }
          }
          return processedApt;
        });
        
        setAppointments(processedAppointments);
      } else {
        setAppointments([]);
      }
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (e) {
      console.error('Error parsing date:', e);
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      return format(parseISO(timeString), 'hh:mm a');
    } catch (e) {
      console.error('Error parsing time:', e);
      return timeString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 mt-6 sm:mt-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-1 sm:mt-2 text-sm text-gray-600">
            View and manage your scheduled appointments
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-3 sm:p-4 mb-4 rounded-r-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button 
              onClick={() => window.location.href = '/login'}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
            >
              Return to login
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-3">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
            <p className="mt-1 sm:mt-2 text-sm text-gray-500">
              You don't have any scheduled appointments at the moment.
            </p>
            <div className="mt-4 sm:mt-6">
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Book an Appointment
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {appointments.map((appointment: any) => (
              <div 
                key={appointment.uid + '-appointment'}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate pr-2">
                      {appointment.car?.make} {appointment.car?.model} ({appointment.car?.year})
                    </h3>
                    <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
                
                <div className="px-4 py-3 sm:px-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center mr-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date & Time</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(appointment.appointmentDate).toDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center mr-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Appointment Time</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatTime(appointment.appointmentTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center col-span-1 sm:col-span-2">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center mr-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium text-gray-900">
                         
                          {appointment?.Branch?.enName || 'Location not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 sm:mt-4 flex justify-end">
                    <button
                      onClick={() => handleViewDetails(appointment)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div
        className="fixed inset-0 overflow-y-auto z-50">
          <div 
          className="flex items-end sm:items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
            style={{ zIndex: 50, position: 'relative' }}
            className="inline-block align-bottom bg-white rounded-t-lg sm:rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              {/* Modal header with close button */}
              <div className="bg-orange-50 px-4 py-3 sm:px-6 flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Appointment Details
                </h3>
                <button
                  type="button"
                  className="bg-orange-50 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setShowModal(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Modal content */}
              <div className="bg-white px-4 py-4 sm:p-6 overflow-y-auto max-h-[70vh] sm:max-h-[80vh]">
                <div className="space-y-4">
                  {/* Date, Time and Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 text-orange-500 mr-2" />
                        <h4 className="text-xs font-medium text-gray-500">Date</h4>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(selectedAppointment.appointmentDate)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center mb-1">
                        <Clock className="h-4 w-4 text-orange-500 mr-2" />
                        <h4 className="text-xs font-medium text-gray-500">Time</h4>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatTime(selectedAppointment.appointmentTime)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center mb-1">
                        <MapPin className="h-4 w-4 text-orange-500 mr-2" />
                        <h4 className="text-xs font-medium text-gray-500">Location</h4>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {selectedAppointment.Branch?.enName || 'Not specified'}
                        </p>
                        <span className={`text-xs font-medium ${getStatusColor(selectedAppointment.status)} px-2 py-0.5 rounded-full`}>
                          {selectedAppointment.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Car className="h-4 w-4 text-orange-500 mr-2" />
                      Vehicle Information
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Make & Model</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedAppointment.car?.make} {selectedAppointment.car?.model}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Year</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedAppointment.car?.year}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Plate Number</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedAppointment.car?.plateNumber || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <User className="h-4 w-4 text-orange-500 mr-2" />
                      Customer Information
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedAppointment.customerName || JSON.parse(localStorage.getItem('userDetails') || '{}').firstName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedAppointment.customerEmail || JSON.parse(localStorage.getItem('userDetails') || '{}').email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Check-in Status */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Check-in Status</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900">Status</p>
                        <p className="text-sm font-medium flex items-center">
                          {selectedAppointment.customerCheckIn ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" /> Checked In
                            </span>
                          ) : (
                            <span className="text-gray-500">Not Checked In</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedAppointment.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FileText className="h-4 w-4 text-orange-500 mr-2" />
                        Notes
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-900">{selectedAppointment.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Modal footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-center">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
