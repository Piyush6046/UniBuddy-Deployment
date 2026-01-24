const { MongoClient } = require("mongodb");

// MongoDB connection string
const uri = "mongodb+srv://domadenikhil:1uooV4uCIDKWipHz@cluster0.o8k3ye6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB collection details
const dbName = "test"; // ✅ This is the correct database name
// Your DB name
const collectionName = "hostels";

// Sample hostel data (👇 You can paste your full array here)
const hostelData = [
  {
    name: "Shivaji Boys Hostel",
    type: "boys",
    rent: 8500,
    rating: 4.1,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
    ],
    services: ["wifi", "security", "electricity", "food", "washing"],
    address: {
      full: "Bhandarkar Road, Matunga East, Mumbai - 400019",
      landmark: "Near King Circle Station",
      gully: "Bhandarkar Lane",
      building: "Shivaji Niwas"
    },
    contact: "9876543101",
    description: "Popular boys hostel for VJTI students with good food and walking distance to college."
  },
  {
    name: "Saraswati Girls Hostel",
    type: "girls",
    rent: 9000,
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
    ],
    services: ["wifi", "security", "electricity", "food", "personal_toilet"],
    address: {
      full: "Telang Road, Matunga East, Mumbai - 400019",
      landmark: "Near Ram Ashraya",
      gully: "Telang Lane",
      building: "Saraswati Sadan"
    },
    contact: "9876543102",
    description: "Safe and clean girls hostel near VJTI with strict security and homely meals."
  },
  {
    name: "VJTI Student Boys PG",
    type: "boys",
    rent: 7800,
    rating: 4.0,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
    ],
    services: ["wifi", "security", "electricity", "washing"],
    address: {
      full: "Hindu Colony, Dadar East, Mumbai - 400014",
      landmark: "Near Five Gardens",
      gully: "Hindu Colony Road",
      building: "Student Residency"
    },
    contact: "9876543103",
    description: "Budget-friendly PG preferred by engineering students of VJTI."
  },
  {
    name: "Annapurna Girls PG",
    type: "girls",
    rent: 8200,
    rating: 4.2,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb"
    ],
    services: ["wifi", "security", "electricity", "food", "water_filter"],
    address: {
      full: "King Circle, Matunga East, Mumbai - 400019",
      landmark: "Near Don Bosco School",
      gully: "Circle Lane",
      building: "Annapurna Bhavan"
    },
    contact: "9876543104",
    description: "Affordable girls PG with pure veg food and peaceful environment."
  },
  {
    name: "Engineers Boys Hostel",
    type: "boys",
    rent: 9200,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c"
    ],
    services: ["wifi", "security", "electricity", "food", "personal_toilet"],
    address: {
      full: "Matunga West, Mumbai - 400016",
      landmark: "Near Matunga Road Station",
      gully: "Station Road",
      building: "Engineers House"
    },
    contact: "9876543105",
    description: "Premium boys hostel mostly occupied by engineering college students."
  },
  {
    name: "Lakshmi Girls Residence",
    type: "girls",
    rent: 8800,
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    ],
    services: ["wifi", "security", "electricity", "food", "washing"],
    address: {
      full: "Sion East, Mumbai - 400022",
      landmark: "Near Sion Circle",
      gully: "Sion Lane 2",
      building: "Lakshmi Residency"
    },
    contact: "9876543106",
    description: "Comfortable girls residence with good connectivity to VJTI."
  },
  {
    name: "Unity Boys PG",
    type: "boys",
    rent: 7200,
    rating: 3.8,
    images: [
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41"
    ],
    services: ["wifi", "security", "electricity"],
    address: {
      full: "Antop Hill, Wadala East, Mumbai - 400037",
      landmark: "Near IMAX Wadala",
      gully: "Unity Road",
      building: "Unity House"
    },
    contact: "9876543107",
    description: "Low-budget boys PG suitable for first-year engineering students."
  },
  {
    name: "Radha Krishna Girls Hostel",
    type: "girls",
    rent: 9400,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
    ],
    services: ["wifi", "security", "electricity", "food", "personal_toilet", "water_filter"],
    address: {
      full: "Dadar East, Mumbai - 400014",
      landmark: "Near Dadar TT Circle",
      gully: "Temple Road",
      building: "Radha Krishna Bhavan"
    },
    contact: "9876543108",
    description: "Premium and safe girls hostel with excellent reviews from parents."
  },
  {
    name: "Techno Boys Hostel",
    type: "boys",
    rent: 8000,
    rating: 4.0,
    images: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4"
    ],
    services: ["wifi", "security", "electricity", "washing", "water_filter"],
    address: {
      full: "Matunga East, Mumbai - 400019",
      landmark: "Near VJTI Main Gate",
      gully: "College Road",
      building: "Techno Residency"
    },
    contact: "9876543109",
    description: "Closest hostel to VJTI campus, ideal for late labs and projects."
  },
  {
    name: "Gokul Girls PG",
    type: "girls",
    rent: 7900,
    rating: 3.9,
    images: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6"
    ],
    services: ["wifi", "security", "electricity", "washing"],
    address: {
      full: "Wadala East, Mumbai - 400037",
      landmark: "Near Monorail Station",
      gully: "Gokul Lane",
      building: "Gokul Sadan"
    },
    contact: "9876543110",
    description: "Economical girls PG with decent facilities and good transport access."
  }
];

async function insertHostelData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.insertMany(hostelData);
    console.log(`✅ ${result.insertedCount} hostels inserted successfully.`);
  } catch (error) {
    console.error("❌ Error inserting hostels:", error.message);
  } finally {
    await client.close();
    console.log("🔌 Disconnected from MongoDB");
  }
}

insertHostelData();
