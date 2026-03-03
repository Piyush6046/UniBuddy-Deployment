
const mongoose = require("mongoose");
require("dotenv").config();
const Hostel = require("./models/Hostel");
const Hotel = require("./models/Hotel");
const Mentor = require("./models/Mentor");
const Books = require("./models/Books");

const seedData = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("✅ Connected to Database...");

        await Hostel.deleteMany({});
        await Hotel.deleteMany({});
        await Mentor.deleteMany({});
        await Books.deleteMany({});
        console.log("🗑️  Cleared old data...");

        // --- HOSTELS DATA (10 ENTRIES) ---
        const hostels = [
            {
                name: "VJTI Boys Hostel (Block A)",
                type: "boys",
                rent: 4000,
                rating: 4.0,
                images: [{ url: "https://images.unsplash.com/photo-1595181827552-0cd6238b7764?w=800", public_id: "h1" }],
                services: ["wifi", "security", "electricity", "water_filter"],
                address: { full: "H.R. Mahajani Road, Matunga", landmark: "Near Library", building: "Block A" },
                contact: "02224198000",
                description: "Official campus hostel for freshmen."
            },
            {
                name: "VJTI Boys Hostel (Block C)",
                type: "boys",
                rent: 5000,
                rating: 4.3,
                images: [{ url: "https://images.unsplash.com/photo-1555854817-40e098bd1457?w=800", public_id: "h2" }],
                services: ["wifi", "security", "electricity", "water_filter", "washroom"],
                address: { full: "H.R. Mahajani Road, Matunga", landmark: "Near Canteen", building: "Block C" },
                contact: "02224198001",
                description: "Reserved for final year students."
            },
            {
                name: "Suncity Premium PG",
                type: "boys",
                rent: 18000,
                rating: 4.8,
                images: [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", public_id: "h3" }],
                services: ["wifi", "security", "electricity", "food", "washing", "personal_toilet"],
                address: { full: "King's Circle, Matunga East", landmark: "Above Mahesh Lunch Home", building: "Mansion 1" },
                contact: "9822110033",
                description: "Luxury student living with AC and housekeeping."
            },
            {
                name: "Five Gardens Girls PG",
                type: "girls",
                rent: 14000,
                rating: 4.6,
                images: [{ url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800", public_id: "h4" }],
                services: ["wifi", "security", "electricity", "food", "water_filter"],
                address: { full: "Five Gardens, Matunga", landmark: "Near Parsi Colony", building: "Garden View" },
                contact: "9123445566",
                description: "Peaceful environment for focused studies."
            },
            {
                name: "Saraswati Niwas",
                type: "girls",
                rent: 12000,
                rating: 4.2,
                images: [{ url: "https://images.unsplash.com/photo-1512918766671-ad6507962077?w=800", public_id: "h5" }],
                services: ["wifi", "security", "electricity", "food"],
                address: { full: "Bhandarkar Road, Matunga", landmark: "Near Station", building: "Niwas" },
                contact: "9833440022",
                description: "Affordable PG for girls with 2-sharing rooms."
            },
            {
                name: "Royal Heights PG",
                type: "boys",
                rent: 16000,
                rating: 4.5,
                images: [{ url: "https://images.unsplash.com/photo-1536376074432-8d64216feb61?w=800", public_id: "h6" }],
                services: ["wifi", "security", "electricity", "food", "washing"],
                address: { full: "Sion West", landmark: "Near Sion Station", building: "Royal Heights" },
                contact: "9988776655",
                description: "Safe area with easy commute to VJTI."
            },
            {
                name: "Matunga Students Hub",
                type: "boys",
                rent: 11000,
                rating: 4.1,
                images: [{ url: "https://images.unsplash.com/photo-1560410645-0ad337583696?w=800", public_id: "h7" }],
                services: ["wifi", "security", "electricity", "water_filter"],
                address: { full: "Adenwala Road, Matunga East", landmark: "Near Don Bosco", building: "Hub Center" },
                contact: "9167008899",
                description: "Budget friendly option for groups."
            },
            {
                name: "Dream Dorms for Women",
                type: "girls",
                rent: 20000,
                rating: 4.9,
                images: [{ url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", public_id: "h8" }],
                services: ["wifi", "security", "food", "washing", "personal_toilet"],
                address: { full: "King's Circle", landmark: "Next to Cafe Madras", building: "Dream Plaza" },
                contact: "9820011223",
                description: "Elite residence with biometrics and private chefs."
            },
            {
                name: "Comfort PG",
                type: "boys",
                rent: 13000,
                rating: 4.4,
                images: [{ url: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=800", public_id: "h9" }],
                services: ["wifi", "security", "electricity", "food", "washing"],
                address: { full: "L.N. Road, Matunga", landmark: "Opposite Flower Market", building: "Comfort Tower" },
                contact: "9167223344",
                description: "Centrally located with all facilities."
            },
            {
                name: "VJTI Girls Campus Hostel",
                type: "girls",
                rent: 5500,
                rating: 4.3,
                images: [{ url: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=800", public_id: "h10" }],
                services: ["wifi", "security", "electricity", "water_filter", "washroom"],
                address: { full: "R.A. Kidwai Road, Matunga", landmark: "Inside Campus", building: "Old Wing" },
                contact: "02224198101",
                description: "Classic on-campus stay."
            }
        ];

        // --- FOOD DATA (8 ENTRIES) ---
        const hotels = [
            {
                name: "Cafe Madras",
                type: "veg",
                rating: 4.9,
                description: "Legendary South Indian breakfast.",
                address: { full: "King's Circle, Matunga", landmark: "Circle" },
                contact: "02224014419",
                images: [{ url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800", public_id: "f1" }],
                menu: [{ item: "Ragi Dosa", price: 80, type: "veg" }, { item: "Filter Kaapi", price: 40, type: "veg" }]
            },
            {
                name: "Guru Kripa",
                type: "veg",
                rating: 4.7,
                description: "Best Samosa Chole in Mumbai.",
                address: { full: "Sion West", landmark: "Next to SIES" },
                contact: "02224074241",
                images: [{ url: "https://images.unsplash.com/photo-1601050690597-df056fb04791?w=800", public_id: "f2" }],
                menu: [{ item: "Samosa Chole", price: 65, type: "veg" }, { item: "Gulab Jamun", price: 45, type: "veg" }]
            },
            {
                name: "Ram Ashraya",
                type: "veg",
                rating: 4.8,
                description: "Authentic Udupi taste.",
                address: { full: "Matunga Station Road", landmark: "Station" },
                contact: "02224102236",
                images: [{ url: "https://images.unsplash.com/photo-1543353071-085f5197a7a5?w=800", public_id: "f3" }],
                menu: [{ item: "Pineapple Sheera", price: 60, type: "veg" }, { item: "Idli Gadbad", price: 90, type: "veg" }]
            },
            {
                name: "Sneha Restaurant",
                type: "both",
                rating: 4.5,
                description: "Kerala style non-veg specialties.",
                address: { full: "Mahim West", landmark: "Paradise Lane" },
                contact: "02224456330",
                images: [{ url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800", public_id: "f4" }],
                menu: [{ item: "Chicken Parotta", price: 180, type: "non-veg" }, { item: "Fish Fry", price: 200, type: "non-veg" }]
            },
            {
                name: "DP's Fast Food",
                type: "both",
                rating: 4.4,
                description: "Student favorite Pav Bhaji and Pizza.",
                address: { full: "Dadara TT", landmark: "Near Chitra Cinema" },
                contact: "02224145326",
                images: [{ url: "https://images.unsplash.com/photo-1626132646529-5470c756ee7b?w=800", public_id: "f5" }],
                menu: [{ item: "Special Pav Bhaji", price: 150, type: "veg" }, { item: "Cheese Grill Sandwich", price: 120, type: "veg" }]
            },
            {
                name: "My Mess",
                type: "veg",
                rating: 4.2,
                description: "Daily home-style tiffins for VJTI students.",
                address: { full: "Matunga East", landmark: "Near Post Office" },
                contact: "9820123456",
                images: [{ url: "https://images.unsplash.com/photo-1547928576-a4a33237bec3?w=800", public_id: "f6" }],
                menu: [{ item: "Full Meal Thali", price: 100, type: "veg", details: "Roti, Sabzi, Dal, Rice" }]
            },
            {
                name: "Healthy Bites",
                type: "both",
                rating: 4.6,
                description: "Salads, Juices and Protein bowls.",
                address: { full: "King's Circle", landmark: "Gym Lane" },
                contact: "9988001122",
                images: [{ url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", public_id: "f7" }],
                menu: [{ item: "Quinoa Bowl", price: 220, type: "veg" }, { item: "Chicken Salad", price: 250, type: "non-veg" }]
            },
            {
                name: "Brijwasi Sweets",
                type: "veg",
                rating: 4.7,
                description: "Quality sweets and snacks since decades.",
                address: { full: "Dadara East", landmark: "Near Station" },
                contact: "02224140022",
                images: [{ url: "https://images.unsplash.com/photo-1589113103503-49667dbb204c?w=800", public_id: "f8" }],
                menu: [{ item: "Ras Malai", price: 50, type: "veg" }, { item: "Dhokla", price: 40, type: "veg" }]
            }
        ];

        // --- MENTORS DATA (10 ENTRIES) ---
        const mentors = [
            {
                name: "Vikram Malhotra",
                email: "vikram.m@alumni.vjti.ac.in",
                phone: "9820011223",
                department: "Computer Engineering",
                passoutYear: 2019,
                companies: ["Google", "Facebook"],
                gender: "Male",
                domain: "Backend & Systems Design",
                image: { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400", public_id: "m1" },
                isApproved: true
            },
            {
                name: "Shreya Singh",
                email: "shreya.s@alumni.vjti.ac.in",
                phone: "9167001122",
                department: "Information Technology",
                passoutYear: 2021,
                companies: ["Microsoft", "Amazon"],
                gender: "Female",
                domain: "Cloud & DevOps",
                image: { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", public_id: "m2" },
                isApproved: true
            },
            {
                name: "Arjun Deshmukh",
                email: "arjun.d@alumni.vjti.ac.in",
                phone: "9122334455",
                department: "Electronics Engineering",
                passoutYear: 2020,
                companies: ["Intel", "Qualcomm"],
                gender: "Male",
                domain: "VLSI & Embedded",
                image: { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", public_id: "m3" },
                isApproved: true
            },
            {
                name: "Neha Kulkarni",
                email: "neha.k@alumni.vjti.ac.in",
                phone: "9833445566",
                department: "Mechanical Engineering",
                passoutYear: 2018,
                companies: ["Tata Motors", "Tesla"],
                gender: "Female",
                domain: "Automotive & Control",
                image: { url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400", public_id: "m4" },
                isApproved: true
            },
            {
                name: "Siddhesh Rane",
                email: "siddhesh@gmail.com",
                phone: "9112233445",
                department: "Civil Engineering",
                passoutYear: 2017,
                companies: ["L&T", "AFCONS"],
                gender: "Male",
                domain: "Structural & Management",
                image: { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", public_id: "m5" },
                isApproved: true
            },
            {
                name: "Pooja Varma",
                email: "pooja@alumni.vjti.ac.in",
                phone: "9122332211",
                department: "Production Engineering",
                passoutYear: 2022,
                companies: ["HUL", "ITC"],
                gender: "Female",
                domain: "Supply Chain & Ops",
                image: { url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400", public_id: "m6" },
                isApproved: true
            },
            {
                name: "Rohan Joshi",
                email: "rohan@gmail.com",
                phone: "9988770011",
                department: "Computer Engineering",
                passoutYear: 2016,
                companies: ["Apple", "Netflix"],
                gender: "Male",
                domain: "AI/ML Research",
                image: { url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400", public_id: "m7" },
                isApproved: true
            },
            {
                name: "Isha Shetty",
                email: "isha@gmail.com",
                phone: "9123454321",
                department: "Information Technology",
                passoutYear: 2023,
                companies: ["Goldman Sachs"],
                gender: "Female",
                domain: "Fintech & Security",
                image: { url: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400", public_id: "m8" },
                isApproved: true
            },
            {
                name: "Manish Goel",
                email: "manish@gmail.com",
                phone: "9876543210",
                department: "Textile Technology",
                passoutYear: 2015,
                companies: ["Raymond", "Reliance"],
                gender: "Male",
                domain: "R&D & Quality Control",
                image: { url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", public_id: "m9" },
                isApproved: true
            },
            {
                name: "Kavita Shah",
                email: "kavita@gmail.com",
                phone: "9167112233",
                department: "Instrumentation Engg",
                passoutYear: 2020,
                companies: ["Siemens", "ABB"],
                gender: "Female",
                domain: "Automation & Robotics",
                image: { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400", public_id: "m10" },
                isApproved: true
            }
        ];

        // --- BOOKS DATA (10 ENTRIES) ---
        const books = [
            {
                name: "Rahul Mehta",
                email: "rahul.m@gmail.com",
                department: "Computer Engineering",
                year: "Third Year",
                semister: 5,
                booksname: ["Database System Concepts - Korth", "Operating System Concepts - Galvin"],
                price: "800",
                contact: "9822114455",
                images: [{ url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", public_id: "b1" }]
            },
            {
                name: "Sakshi Patil",
                email: "sakshi.p@gmail.com",
                department: "Information Technology",
                year: "Second Year",
                semister: 3,
                booksname: ["Data Structures in C - Reema Thareja", "Digital Logic Design"],
                price: "450",
                contact: "9167112233",
                images: [{ url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400", public_id: "b2" }]
            },
            {
                name: "Karan Johar",
                email: "karan.j@gmail.com",
                department: "Mechanical Engineering",
                year: "Final Year",
                semister: 7,
                booksname: ["Engineering Thermodynamics - PK Nag", "Machine Design - VB Bhandari"],
                price: "1200",
                contact: "9988776655",
                images: [{ url: "https://images.unsplash.com/photo-1512428559083-a40ce7ba6e6f?w=400", public_id: "b3" }]
            },
            {
                name: "Anjali Dubey",
                email: "anjali@gmail.com",
                department: "Electronics Engineering",
                year: "First Year",
                semister: 1,
                booksname: ["Engineering Drawing - ND Bhatt", "Engineering Mechanics - Bhavikatti"],
                price: "700",
                contact: "9123440022",
                images: [{ url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400", public_id: "b4" }]
            },
            {
                name: "Vivek Roy",
                email: "vivek@gmail.com",
                department: "Civil Engineering",
                year: "Third Year",
                semister: 6,
                booksname: ["Reinforced Concrete Design - Pillai & Menon", "Soil Mechanics"],
                price: "950",
                contact: "9822334455",
                images: [{ url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400", public_id: "b5" }]
            },
            {
                name: "Mansi Iyer",
                email: "mansi@gmail.com",
                department: "Computer Engineering",
                year: "Second Year",
                semister: 4,
                booksname: ["Theory of Computation - Peter Linz", "Microprocessors 8085"],
                price: "500",
                contact: "9167001122",
                images: [{ url: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400", public_id: "b6" }]
            },
            {
                name: "Aditya Shah",
                email: "adi@gmail.com",
                department: "Information Technology",
                year: "Final Year",
                semister: 8,
                booksname: ["Cloud Computing - Kai Hwang", "Mobile Computing"],
                price: "600",
                contact: "9833445566",
                images: [{ url: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400", public_id: "b7" }]
            },
            {
                name: "Simran Kaur",
                email: "simran@gmail.com",
                department: "Production Engineering",
                year: "Third Year",
                semister: 5,
                booksname: ["Operations Research - Hira & Gupta", "Work Study"],
                price: "350",
                contact: "9112233445",
                images: [{ url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400", public_id: "b8" }]
            },
            {
                name: "Abhishek Singh",
                email: "abhi@gmail.com",
                department: "Electrical Engineering",
                year: "Second Year",
                semister: 3,
                booksname: ["Network Analysis - Van Valkenburg", "Electrical Machines"],
                price: "550",
                contact: "9988772211",
                images: [{ url: "https://images.unsplash.com/photo-1524578271613-d550eebead07?w=400", public_id: "b9" }]
            },
            {
                name: "Deepak Rawat",
                email: "deep@gmail.com",
                department: "Textile Technology",
                year: "Final Year",
                semister: 7,
                booksname: ["Garment Manufacturing - Gerry Cooklin", "Spinning Technology"],
                price: "900",
                contact: "9122334466",
                images: [{ url: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400", public_id: "b10" }]
            }
        ];

        console.log("⌛ Inserting large dataset...");
        await Hostel.insertMany(hostels);
        await Hotel.insertMany(hotels);
        await Mentor.insertMany(mentors);
        await Books.insertMany(books);

        console.log("✨ Seeding Complete!");
        console.log(`- Hostels: ${hostels.length}`);
        console.log(`- Food Spots: ${hotels.length}`);
        console.log(`- Mentors: ${mentors.length}`);
        console.log(`- Books: ${books.length}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedData();
