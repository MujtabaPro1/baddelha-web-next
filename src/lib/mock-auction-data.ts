export type AuctionStatus = "Live" | "Ending Soon" | "Hot Bid" | "Approved" | "Upcoming";

export interface AuctionCar {
  id: string;
  name: string;
  year: number;
  mileage: string;
  fuelType: string;
  transmission: string;
  currentBid: string;
  status: AuctionStatus;
  timeLeft: string;
  location: string;
  image: string;
}

export const auctionCars: AuctionCar[] = [
  {
    id: "1",
    name: "Toyota Land Cruiser GXR",
    year: 2023,
    mileage: "42,000 km",
    fuelType: "Petrol",
    transmission: "Automatic",
    currentBid: "SAR 198,000",
    status: "Live",
    timeLeft: "02:14:33",
    location: "Riyadh",
    image: "https://images.unsplash.com/photo-1650530579355-7ad9d4766043?q=80&w=600&h=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    name: "Lexus ES 350",
    year: 2022,
    mileage: "31,500 km",
    fuelType: "Petrol",
    transmission: "Automatic",
    currentBid: "SAR 121,500",
    status: "Ending Soon",
    timeLeft: "00:34:10",
    location: "Jeddah",
    image: "https://images.unsplash.com/photo-1615106806531-183c31fccfdc?w=600&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TGV4dXMlMjBFUyUyMDM1MHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "3",
    name: "Ford Territory Trend",
    year: 2024,
    mileage: "12,000 km",
    fuelType: "Petrol",
    transmission: "Automatic",
    currentBid: "SAR 83,000",
    status: "Live",
    timeLeft: "03:11:50",
    location: "Dammam",
    image: "https://images.unsplash.com/photo-1663576242343-3754bafa527c?w=600&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEZvcmQlMjBUZXJyaXRvcnklMjBUcmVuZHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "4",
    name: "GMC Yukon SLE",
    year: 2021,
    mileage: "68,000 km",
    fuelType: "Petrol",
    transmission: "Automatic",
    currentBid: "SAR 146,000",
    status: "Approved",
    timeLeft: "05:42:15",
    location: "Riyadh",
    image: "https://images.unsplash.com/photo-1761318752375-978b6922a157?w=600&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8R01DJTIwWXVrb258ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "5",
    name: "Hyundai Sonata Smart",
    year: 2023,
    mileage: "22,000 km",
    fuelType: "Petrol",
    transmission: "Automatic",
    currentBid: "SAR 74,500",
    status: "Live",
    timeLeft: "01:19:22",
    location: "Khobar",
    image: "https://www.dubicars.com/images/83312f/w_1300x760/al-sayed-khamis/88abdaf5-dac5-400c-b36e-68016604a463.jpg",
  },
  {
    id: "6",
    name: "Nissan Patrol SE",
    year: 2022,
    mileage: "49,000 km",
    fuelType: "Petrol",
    transmission: "Automatic",
    currentBid: "SAR 173,000",
    status: "Hot Bid",
    timeLeft: "00:52:08",
    location: "Riyadh",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTixz5eQTU85GllhntdTyDM65IvzC94Ibv3Hg&s",
  },
];
