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
    const { ResidentModel, TeacherModel, TrainerModel, TrainerProgress } = await import('./models');
    
    // Seed residents
    try {
      const residentCount = await ResidentModel.countDocuments();
      if (residentCount === 0) {
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
    } catch (error) {
      console.error('Error seeding residents:', error);
    }
    
    // Seed teachers (skip errors)
    try {
      const teacherCount = await TeacherModel.countDocuments();
      if (teacherCount === 0) {
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
      console.error('Error seeding teachers:', error);
    }
    
    // Seed trainers
    try {
      const trainerCount = await TrainerModel.countDocuments();
      if (trainerCount === 0) {
      // Seed trainers with TrainerProgress
      const currentYear = new Date().getFullYear();
      const academicYear = `${currentYear}-${currentYear + 1}`;
      
      const trainers = [
        {
          id: "T001",
          name: "احمد",
          lastName: "احمدی",
          parentType: "پدر",
          parentName: "محمد",
          gender: "مرد",
          province: "کابل",
          department: "طب داخلی",
          specialty: "قلب و عروق",
          hospital: "شفاخانه جمهوریت",
          joiningDate: new Date(currentYear, 0, 15),
          trainingYear: "سال اول",
          supervisorName: "دوکتور رحیمی",
          birthDate: new Date(1995, 5, 10),
          idNumber: "1234567890",
          phoneNumber: "0700123456",
          whatsappNumber: "0700123456",
          email: "ahmad@example.com",
          postNumberAndCode: "1001",
          appointmentType: "رقابت آزاد",
          status: "برحال"
        },
        {
          id: "T002",
          name: "فاطمه",
          lastName: "فاطمی",
          parentType: "پدر",
          parentName: "علی",
          gender: "زن",
          province: "هرات",
          department: "اطفال",
          specialty: "طب اطفال",
          hospital: "شفاخانه حیات",
          joiningDate: new Date(currentYear, 1, 1),
          trainingYear: "سال اول",
          supervisorName: "دوکتور نوری",
          birthDate: new Date(1996, 3, 15),
          idNumber: "0987654321",
          phoneNumber: "0700234567",
          whatsappNumber: "0700234567",
          email: "fatima@example.com",
          postNumberAndCode: "2001",
          appointmentType: "داوطلب",
          status: "برحال"
        },
        {
          id: "T003",
          name: "حسن",
          lastName: "حسنی",
          parentType: "پدر",
          parentName: "حسین",
          gender: "مرد",
          province: "بلخ",
          department: "جراحی",
          specialty: "جراحی عمومی",
          hospital: "شفاخانه بلخی",
          joiningDate: new Date(currentYear - 1, 0, 10),
          trainingYear: "سال دوم",
          supervisorName: "دوکتور کریمی",
          birthDate: new Date(1994, 7, 20),
          idNumber: "1122334455",
          phoneNumber: "0700345678",
          whatsappNumber: "0700345678",
          email: "hassan@example.com",
          postNumberAndCode: "3001",
          appointmentType: "حکمی",
          status: "برحال"
        }
      ];
      
      const createdTrainers = await TrainerModel.insertMany(trainers);
      console.log('Sample trainers data seeded successfully');
      
      // Create TrainerProgress for each trainer
      for (let i = 0; i < createdTrainers.length; i++) {
        const trainer = createdTrainers[i];
        const isSecondYear = i === 2; // Third trainer is in second year
        
        const progress = {
          trainer: trainer._id,
          startYear: isSecondYear ? `${currentYear - 1}` : `${currentYear}`,
          currentTrainingYear: isSecondYear ? "سال دوم" : "سال اول",
          trainingHistory: isSecondYear ? [
            {
              yearLabel: "سال اول",
              academicYear: `${currentYear - 1}-${currentYear}`,
              startYear: `${currentYear - 1}`,
              endYear: `${currentYear}`,
              status: "ختم شده",
              forms: {}
            },
            {
              yearLabel: "سال دوم",
              academicYear: `${currentYear}-${currentYear + 1}`,
              startYear: `${currentYear}`,
              status: "در حال آموزش",
              forms: {}
            }
          ] : [
            {
              yearLabel: "سال اول",
              academicYear: academicYear,
              startYear: `${currentYear}`,
              status: "در حال آموزش",
              forms: {}
            }
          ],
          promoted: false,
          lastUpdated: new Date()
        };
        
        await TrainerProgress.create(progress);
      }
      
      console.log('Sample trainer progress data seeded successfully');
      }
    } catch (error) {
      console.error('Error seeding trainers:', error);
    }
  } catch (error) {
    console.error('Error in seedDatabase function:', error);
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