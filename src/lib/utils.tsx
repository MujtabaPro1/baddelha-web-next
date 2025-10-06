import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}







export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  return res.json();
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
   const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};


export const isEmpty = (obj: any) => {
  return !obj ? true : Object.keys(obj).length == 0;
}


export const validateEmail = (email: any) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export const numberWithCommas = (x: any) => {

  if(!x){
    return "";
  }

  x = x.toString();
   const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
    x = x.replace(pattern, "$1,$2");
  return x;
}


export const inspectionData = [
  {
    name: 'General Information',
    fields: [
      {
        fieldName: 'Make',
        fieldType: 'Field',
        value: '',
        disabled: true,
        required: true,
      },
      {
        fieldName: 'Model',
        fieldType: 'Field',
        value: '',

        disabled: true,
        required: true,
      },
      {
        fieldName: 'Exact Model',
        fieldType: 'Field',
        value: '',

        disabled: false,
        required: false,
      },
      {
        fieldName: 'Year',
        fieldType: 'Field',
        value: '',

        disabled: true,
        required: true,
      },
      {
        fieldName: 'VIN',
        fieldType: 'Field',
        value: '',

        disabled: true,
        required: true,
      },
      {
        fieldName: 'Odometer Reading (KM)',
        fieldType: 'Field',
        value: '',
        required: true,
      },
      {
        fieldName: 'Transmission',
        fieldType: 'Drop Down',
        options: ['Automatic', 'Manual', 'Hybrid', 'Electric'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Engine Size',
        fieldType: 'Drop Down',
        options: [
          '1.0',
          '1.1',
          '1.2',
          '1.3',
          '1.4',
          '1.5',
          '1.6',
          '1.7',
          '1.8',
          '1.9',
          '2.0',
          '2.1',
          '2.2',
          '2.3',
          '2.4',
          '2.5',
          '2.6',
          '2.7',
          '2.8',
          '2.9',
          '3.0',
          '3.1',
          '3.2',
          '3.3',
          '3.4',
          '3.5',
          '3.6',
          '3.7',
          '3.8',
          '3.9',
          '4.0',
          '4.1',
          '4.2',
          '4.3',
          '4.4',
          '4.5',
          '4.6',
          '4.7',
          '4.8',
          '4.9',
          '5.0',
          '5.1',
          '5.2',
          '5.3',
          '5.4',
          '5.5',
          '5.6',
          '5.7',
          '5.8',
          '5.9',
          '6.0',
          '6.1',
          '6.2',
          '6.3',
          '6.4',
          '6.5',
          '6.6',
          '6.7',
          '6.8',
          '6.9',
          '7.0',
          '7.1',
          '7.2',
          '7.3',
          '7.4',
          '7.5',
          '7.6',
          '7.7',
          '7.8',
          '7.9',
          '8.0',
          '8.1',
          '8.2',
          '8.3',
          '8.4',
          '8.5',
          '8.6',
          '8.7',
          '8.8',
          '8.9',
          '9.0',
          '9.1',
          '9.2',
          '9.3',
          '9.4',
          '9.5',
          '9.6',
          '9.7',
          '9.8',
          '9.9',
          '10.0',
          '10.1',
          '10.2',
          '10.3',
          '10.4',
          '10.5',
          '10.6',
          '10.7',
          '10.8',
          '10.9',
          '11.0',
          '11.1',
          '11.2',
          '11.3',
          '11.4',
          '11.5',
          '11.6',
          '11.7',
          '11.8',
          '11.9',
          '12.0',
          '12.1',
          '12.2',
          '12.3',
          '12.4',
          '12.5',
          '12.6',
          '12.7',
          '12.8',
          '12.9',
          '13.0',
          '13.1',
          '13.2',
          '13.3',
          '13.4',
          '13.5',
          '13.6',
          '13.7',
          '13.8',
          '13.9',
          '14.0',
          '14.1',
          '14.2',
          '14.3',
          '14.4',
          '14.5',
          '14.6',
          '14.7',
          '14.8',
          '14.9',
          '15.0',
          '15.1',
          '15.2',
          '15.3',
          '15.4',
          '15.5',
          '15.6',
          '15.7',
          '15.8',
          '15.9',
          '16.0',
          '16.1',
          '16.2',
          '16.3',
          '16.4',
          '16.5',
          '16.6',
          '16.7',
          '16.8',
          '16.9',
          '17.0',
          '17.1',
          '17.2',
          '17.3',
          '17.4',
          '17.5',
          '17.6',
          '17.7',
          '17.8',
          '17.9',
          '18.0',
          '18.1',
          '18.2',
          '18.3',
          '18.4',
          '18.5',
          '18.6',
          '18.7',
          '18.8',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Interior Trim',
        fieldType: 'Drop Down',
        options: ['Leather', 'Fabric', 'Others'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Steering Wheel Location',
        fieldType: 'Drop Down',
        options: ['Left', 'Right'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Paint',
        fieldType: 'Drop Down',
        options: ['Original Paint', 'Potion Repainted', 'Fully Repainted'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Fuel Type',
        fieldType: 'Drop Down',
        options: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG', 'Others'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Color',
        fieldType: 'Drop Down',
        options: [
          'Red',
          'Blue',
          'Green',
          'Yellow',
          'Orange',
          'Purple',
          'Pink',
          'Brown',
          'Black',
          'White',
          'Silver',
          'Gray',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Navigation System',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'VIN Plate',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Number of Keys',
        fieldType: 'Drop Down',
        options: ['1', '2', '3', '4', 'Not Available'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Roof',
        fieldType: 'Drop Down',
        options: ['Regular', 'Sunroof', 'Panoramic'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Rim Type',
        fieldType: 'Drop Down',
        options: ['Alloy', 'Steel', 'Plastic', 'Not Available'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Rim Condition',
        fieldType: 'Drop Down',
        options: ['Okay', 'Scratched', 'Damaged'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Number of Tires',
        fieldType: 'Drop Down',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'N/A'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Seat Color',
        fieldType: 'Drop Down',
        options: [
          'Red',
          'Blue',
          'Green',
          'Yellow',
          'Orange',
          'Purple',
          'Pink',
          'Brown',
          'Black',
          'White',
          'Silver',
          'Gray',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Warranty Plan',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Warranty Valid Till',
        fieldType: 'Date',
        value: '',
        required: false,
      },
      {
        fieldName: 'Service History',
        fieldType: 'Drop Down',
        options: [
          'Full Service History',
          'Partial Service History',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Service Plan',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Service Plan Valid Till',
        fieldType: 'Date',

        required: false,
      },
      {
        fieldName: 'VIN Clone Check',
        fieldType: 'Drop Down',
        options: ['Completed', 'N/A', 'Failed'],
        value: '',
        required: true,
      },
    ],
  },
  {
    name: 'Car Body',
    fields: [
      {
        fieldName: 'Bonnet Replaced?',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Bonnet Condition',
        fieldType: 'Drop Down',
        options: [
          'Damaged',
          'Repainted',
          'Portion Repainted',
          'Original Paint',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Wing Front Left Replaced?',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Wing Front Left Condition',
        fieldType: 'Drop Down',
        options: [
          'Damaged',
          'Repainted',
          'Portion Repainted',
          'Original Paint',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Wing Front Right Replaced?',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Wing Front Right Condition',
        fieldType: 'Drop Down',
        options: [
          'Damaged',
          'Repainted',
          'Portion Repainted',
          'Original Paint',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Door Rear Right Replaced?',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Door Rear Right Condition',
        fieldType: 'Drop Down',
        options: [
          'Damaged',
          'Repainted',
          'Portion Repainted',
          'Original Paint',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Rear Bumper Replaced?',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Rear Bumper Condition',
        fieldType: 'Drop Down',
        options: [
          'Damaged',
          'Repainted',
          'Portion Repainted',
          'Original Paint',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Boot Replaced?',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Boot Condition',
        fieldType: 'Drop Down',
        options: [
          'Damaged',
          'Repainted',
          'Portion Repainted',
          'Original Paint',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Door Front Left Replaced?',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Door Front Left Condition',
        fieldType: 'Drop Down',
        options: [
          'Damaged',
          'Repainted',
          'Portion Repainted',
          'Original Paint',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Roof Condition',
        fieldType: 'Drop Down',
        options: [
          'Damaged',
          'Repainted',
          'Portion Repainted',
          'Original Paint',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Roof Rack Condition',
        fieldType: 'Drop Down',
        options: [
          'Good',
          'Average',
          'Need to be replaced soon',
          'Damaged',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Bumper Front Replaced?',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Bumper Front Condition',
        fieldType: 'Drop Down',
        options: [
          'Damaged',
          'Repainted',
          'Portion Repainted',
          'Original Paint',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Door Front Right Replaced?',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Door Front Right Condition',
        fieldType: 'Drop Down',
        options: [
          'Damaged',
          'Repainted',
          'Portion Repainted',
          'Original Paint',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Wing Right Rear Replaced?',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Wing Right Rear Condition',
        fieldType: 'Drop Down',
        options: [
          'Damaged',
          'Repainted',
          'Portion Repainted',
          'Original Paint',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Wing Rear Left Replaced?',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
        required: true,
      },
      {
        fieldName: 'Wing Rear Left Condition',
        fieldType: 'Drop Down',
        options: [
          'Damaged',
          'Repainted',
          'Portion Repainted',
          'Original Paint',
          'Not Available',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Sunroof / Moonroof Condition',
        fieldType: 'Drop Down',
        options: [
          'Okay',
          'Damaged',
          'Not Applicable',
          'May Require Maintenance',
        ],
        value: '',
        required: true,
      },
      {
        fieldName: 'Convertible Top Condition',
        fieldType: 'Drop Down',
        options: [
          'Okay',
          'Damaged',
          'Not Applicable',
          'May Require Maintenance',
        ],
        value: '',
        required: true,
      },
    ],
  },
  {
    name: 'Glass and Outside Mirrors',
    fields: [
      {
        fieldName: 'Windshield Glass',
        fieldType: 'Drop Down',
        options: ['Okay', 'Chipped', 'Cracked', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Sunroof Glass',
        fieldType: 'Drop Down',
        options: ['Okay', 'Chipped', 'Cracked', 'Not Applicable'],
        value: '',
      },
    ],
  },
  {
    name: 'Lights',
    fields: [
      {
        fieldName: 'Front-end Exterior Lights',
        fieldType: 'Drop Down',
        options: ['Okay', 'Dimmed', 'Not Working', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Side Exterior Right',
        fieldType: 'Drop Down',
        options: ['Okay', 'Dimmed', 'Not Working', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Side Exterior Left',
        fieldType: 'Drop Down',
        options: ['Okay', 'Dimmed', 'Not Working', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Backend Exterior Lights',
        fieldType: 'Drop Down',
        options: ['Okay', 'Dimmed', 'Not Working', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Hazard Lights',
        fieldType: 'Drop Down',
        options: ['Okay', 'Dimmed', 'Not Working', 'Not Available'],
        value: '',
      },
    ],
  },
  {
    name: 'Audio Entertainment',
    fields: [
      {
        fieldName: 'Radio, Cassette, CD and Speakers',
        fieldType: 'Drop Down',
        options: ['Okay', 'Not Working', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Board Computer',
        fieldType: 'Drop Down',
        options: ['Okay', 'Not Working', 'Not Available'],
        value: '',
      },
    ],
  },
  {
    name: 'AC',
    fields: [
      {
        fieldName: 'Air Conditioning System',
        fieldType: 'Drop Down',
        options: ['Okay', 'Not Working', 'Not Available'],
        value: '',
      },
    ],
  },
  {
    name: 'Interior Amenities',
    fields: [
      {
        fieldName: 'Warning Signals Active?',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
      },
      {
        fieldName: 'Horn',
        fieldType: 'Drop Down',
        options: ['Okay', 'Not Working', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Steering Wheel Controls',
        fieldType: 'Drop Down',
        options: ['Okay', 'Not Working', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Glove Box',
        fieldType: 'Drop Down',
        options: ['Okay', 'Not Working', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Window Controls',
        fieldType: 'Drop Down',
        options: ['Okay', 'Not Working', 'Not Available'],
        value: '',
      },
    ],
  },
  {
    name: 'Carpet, Trim and Mats',
    fields: [
      {
        fieldName: 'Headliner',
        fieldType: 'Drop Down',
        options: ['Okay', 'Need Replacement', 'Damaged', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Floor Mat ',
        fieldType: 'Drop Down',
        options: ['Yes', 'Not Available'],
        value: '',
      },
    ],
  },
  {
    name: 'Seats',
    fields: [
      {
        fieldName: 'Safety Belts',
        fieldType: 'Drop Down',
        options: ['Okay', 'Need Replacement', 'Damaged', 'Not Available'],
        value: '',
      },
    ],
  },
  {
    name: 'Luggage Compartment',
    fields: [
      {
        fieldName: 'Vehicle Tool Kit',
        fieldType: 'Drop Down',
        options: ['Available', 'Not Available'],
        value: '',
      },
    ],
  },
  {
    name: 'Test Drive General',
    fields: [
      {
        fieldName: 'Engine Starts Properly?',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
      },
      {
        fieldName: 'Engine Condition',
        fieldType: 'Drop Down',
        options: ['Normal', 'Misfiring', 'Overheating', 'Not Starting', 'Stalling', 'Battery Dead'],
        value: '',
      },
      {
        fieldName: 'Engine Visual Inspection',
        fieldType: 'Drop Down',
        options: ['Normal', 'Oil Leak', 'Coolant Leak', 'Damaged', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'General Driving Condition',
        fieldType: 'Drop Down',
        options: ['Normal (Drives Smoothly)', 'Uneven or Bumpy', 'Vibrations/ Noise While Driving'],
        value: '',
      },
      {
        fieldName: 'Steering',
        fieldType: 'Drop Down',
        options: ['Normal (Responsive, Smooth)', 'Heavy/ Hard Steering', 'Steering Noise', 'Pulls to One Side'],
        value: '',
      },
      {
        fieldName: 'Brakes',
        fieldType: 'Drop Down',
        options: ['Normal (Responsive, Smooth)', 'Noisy', 'Vibration When Braking'],
        value: '',
      },
      {
        fieldName: 'Transmission',
        fieldType: 'Drop Down',
        options: ['Normal (Shifts Smoothly)', 'Jerking', 'Slipping Gears', 'Delayed Response'],
        value: '',
      },
      {
        fieldName: 'Exhaust',
        fieldType: 'Drop Down',
        options: ['Normal Stock', 'Normal Aftermarket', 'White Smoke', 'Black Smoke', 'Blue Smoke'],
        value: '',
      },
    ],
  },
  {
    name: 'Tires and Wheels',
    fields: [
      {
        fieldName: 'Tire Matching',
        fieldType: 'Drop Down',
        options: ['Yes', 'No'],
        value: '',
      },
      {
        fieldName: 'Front Left Tire Condition',
        fieldType: 'Drop Down',
        options: ['Okay', 'Need Replacement', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Front Right Tire Condition',
        fieldType: 'Drop Down',
        options: ['Okay', 'Need Replacement', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Rear Left Tire Condition',
        fieldType: 'Drop Down',
        options: ['Okay', 'Need Replacement', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Front Right Tire Condition',
        fieldType: 'Drop Down',
        options: ['Okay', 'Need Replacement', 'Not Available'],
        value: '',
      },
    ],
  },
  {
    name: 'Brakes',
    fields: [
      {
        fieldName: 'Brake Pads/ Shoes',
        fieldType: 'Drop Down',
        options: ['Okay', 'Need Replacement', 'Not Available'],
        value: '',
      },
      {
        fieldName: 'Parking Brake',
        fieldType: 'Drop Down',
        options: ['Okay', 'Need Replacement', 'Not Available'],
        value: '',
      },
    ],
  },
  {
    name: 'Document Images',
    fields: [
      'Seller ID Front',
      'Seller ID Back',
      'Registration Sticker',
      'VIN Number Plate',
      'VIN Number Plate Firewall',
    ],
  },
  {
    name: 'Car Media',
    fields: [
      'Front',
      'Right',
      'Left',
      'Back',
      'Exterior Roof',
      'Engine',
      'Radiator and Cap',
      'Rear Compartment (Boot)',
      'Tire',
      'Odometer',
      'Steering Wheel',
      'Center Console',
      'Dashboard',
      'Driver Door Inside',
      'Left Console',
      'Front Seats',
      'Rear Seats',
      'Interior Roof',
      'Underneath Front',
      'Underneath Rear',
      'Car Keys',
      'Other',
    ],
  },
  {
    name: 'Extras',
    fields: [
      {
        fieldName: 'Remarks',
        fieldType: 'TextArea',
        value: '',
      },
    ],
  },
];



export const CarMileage = 
[
  {
    value: '5000',
    label: 'Up to 5,000 KM',
  },
  {
    value: '10000',
    label: 'Up to 10,000 KM',
  },
  {
    value: '20000',
    label: 'Up to 20,000 KM',
  },
  {
    value: '30000',
    label: 'Up to 30,000 KM',
  },
  {
    value: '40000',
    label: 'Up to 40,000 KM',
  },
  {
    value: '60000',
    label: 'Up to 60,000 KM',
  },
  {
    value: '80000',
    label: 'Up to 80,000 KM',
  },
  {
    value: '100000',
    label: 'Up to 100,000 KM',
  },
  {
    value: '125000',
    label: 'Up to 125,000 KM',
  },
  {
    value: '150000',
    label: 'Up to 150,000 KM',
  },
  {
    value: '175000',
    label: 'Up to 175,000 KM',
  },
  {
    value: '200000',
    label: 'Up to 200,000 KM',
  },
  {
    value: '225000',
    label: 'Up to 225,000 KM',
  },
  {
    value: '250000',
    label: 'Up to 250,000 KM',
  },
  {
    value: '250001',
    label: 'More than 250,000 KM',
  },
  {
    value: 'i_dont_know',
    label: 'Don’t know, assume normal usage',
  },
];
