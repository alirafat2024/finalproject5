import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

// MongoDB connection string - prioritize environment variable first
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-residents';

// If DATABASE_URL is set and looks like MongoDB, use it
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('mongodb')) {
  MONGODB_URI = process.env.DATABASE_URL;
} else if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql')) {
  console.log('PostgreSQL DATABASE_URL detected, using in-memory MongoDB for hospital data');
}

let isConnected = false;

// Connect to MongoDB with retry logic
export async function connectDB() {
  if (isConnected) {
    return;
  }
  
  try {
    // Try to connect to regular MongoDB first
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('Connected to MongoDB successfully at:', MONGODB_URI);
    await seedDatabase();
  } catch (error) {
    console.warn('MongoDB connection failed, starting in-memory MongoDB server:', (error as Error).message);
    
    try {
      // Start MongoDB Memory Server
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      isConnected = true;
      console.log('Connected to in-memory MongoDB successfully at:', uri);
      await seedDatabase();
    } catch (memError) {
      console.error('Failed to start in-memory MongoDB:', (memError as Error).message);
      await initializeInMemoryData();
      throw memError;
    }
  }
}

// Seed database with sample data
async function seedDatabase() {
  // Only seed if actually connected to MongoDB
  if (!isConnected || mongoose.connection.readyState !== 1) {
    console.log('Skipping database seeding - MongoDB not connected');
    return;
  }
  
  try {
    const { ResidentModel, TeacherModel } = await import('./models');
    
    // Check if data already exists
    const residentCount = await ResidentModel.countDocuments();
    const teacherCount = await TeacherModel.countDocuments();
    
    if (residentCount === 0) {
      // Seed residents
      const residents = [
        {
          fullName: "Dr. Sarah Johnson",
          age: 28,
          gender: "Female",
          department: "Internal Medicine",
          startDate: new Date("2024-01-15"),
          status: "active"
        },
        {
          fullName: "Dr. Michael Chen",
          age: 29,
          gender: "Male", 
          department: "Surgery",
          startDate: new Date("2024-02-01"),
          status: "active"
        },
        {
          fullName: "Dr. Emily Rodriguez",
          age: 27,
          gender: "Female",
          department: "Pediatrics", 
          startDate: new Date("2024-03-10"),
          status: "active"
        }
      ];
      
      await ResidentModel.insertMany(residents);
      console.log('Sample residents data seeded successfully');
    }
    
    if (teacherCount === 0) {
      // Seed teachers
      const teachers = [
        {
          fullName: "Dr. Robert Williams",
          email: "r.williams@hospital.com",
          phone: "555-0101",
          department: "Internal Medicine",
          academicRank: "Professor",
          appointmentDate: new Date("2015-08-01"),
          status: "active"
        },
        {
          fullName: "Dr. Lisa Anderson",
          email: "l.anderson@hospital.com", 
          phone: "555-0102",
          department: "Surgery",
          academicRank: "Associate Professor",
          appointmentDate: new Date("2018-09-15"),
          status: "active"
        }
      ];
      
      await TeacherModel.insertMany(teachers);
      console.log('Sample teachers data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Initialize in-memory data when MongoDB is not available
async function initializeInMemoryData() {
  console.log('MongoDB initialization failed, using in-memory storage');
}

// Check if MongoDB is connected
export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

// Export mongoose for direct use if needed
export { mongoose };