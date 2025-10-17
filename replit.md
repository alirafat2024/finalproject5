# Hospital Resident Management System

## Overview

This is a web-based Hospital Resident Management System designed to track and manage medical residents (specialist trainees) throughout their training period. The system handles comprehensive resident profiles, mandatory training forms, performance evaluations, disciplinary actions, and faculty supervision. It provides role-based access control with admin and viewer permissions, along with reporting capabilities for institutional oversight.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### October 10, 2025
**Lecture File Upload and Download System (Latest):**
- ✅ Implemented complete file upload and download system for lectures with backward compatibility
- ✅ Updated Lecture model to support file metadata (filename, originalName, path, size)
- ✅ Added Multer file upload middleware for lectures (10MB max per file, up to 10 files)
- ✅ Files stored in `uploads/lectures/` directory with unique naming
- ✅ Created secure download endpoint at `/api/lectures/download/:filename` with path traversal protection
- ✅ Updated LectureModal to upload files using FormData instead of just storing filenames
- ✅ Enhanced TrainerLecturesModal to display downloadable files with size information
- ✅ Implemented backward compatibility:
  - Supports both legacy format (string array) and new format (file metadata objects)
  - Old lectures display filenames without download button (safe degradation)
  - New lectures show download buttons with file size information
  - TypeScript types updated to handle both formats: `(FileInfo | string)[]`
- ✅ All changes tested and verified by architect review
- ✅ Added uploads/lectures/ to .gitignore

**Enhanced Viewer Role Restrictions (Action Button):**
- ✅ Hidden "Action" button (اکشن) in Trainee/Residents page for viewer accounts
- ✅ Only admin users can now see and use the action button
- ✅ Viewers maintain read-only access to resident information
- ✅ All changes verified and approved by architect review

**Trainer Actions File Upload System:**
- ✅ Updated TrainerAction database model to support file uploads instead of form selections
  - Changed from `selectedForms` array to `files` array with metadata (filename, originalName, path, size)
- ✅ Implemented secure file upload with Multer middleware:
  - Support for up to 10 files per action (10MB max per file)
  - Files stored in `uploads/trainer-actions/` directory
  - Secure download endpoint with path traversal protection
  - Automatic file cleanup when action is deleted
- ✅ Enhanced TrainerActionModal component:
  - Description text area for action details
  - Drag-and-drop file upload interface supporting multiple files
  - Display of uploaded files with download functionality
  - File size formatting and validation
  - Admin-only access to create and delete actions (viewers have read-only access)
- ✅ Role-based access control enforced:
  - Submit action button visible only to admins
  - Delete action button visible only to admins
  - Viewers can view actions and download files but cannot create/delete
- ✅ Security measures implemented:
  - Filename sanitization to prevent path traversal attacks
  - Normalized path checks to ensure files stay within upload directory
  - Route ordering fixed to ensure download endpoint accessibility
- ✅ Added uploads/ to .gitignore to prevent committing uploaded files
- ✅ All changes tested and verified by architect review

**Enhanced Viewer Role Restrictions:**
- ✅ Hidden Settings/Users menu item from sidebar for viewer accounts (only admins see it)
- ✅ Hidden "Add Form" button in Training/Trainee (residents) section for viewers
- ✅ Hidden "Edit" button in Teachers table for viewers (only admins can edit)
- ✅ Hidden "Add Lecture" button in Teachers table for viewers
- ✅ Hidden "Edit" and "Delete" buttons in Users management page for viewers
- ✅ All admin-only UI controls now properly restricted based on user role
- ✅ Viewers have read-only access throughout the entire application
- ✅ All changes verified and approved by architect review

**Previous Role-Based Access Control Enhancement:**
- ✅ Implemented comprehensive viewer role restrictions across all create/add operations
- ✅ Added admin-only access control to "Add Form" button in resident-card.tsx
- ✅ Added admin-only access control to "Add Teacher" button in teachers.tsx
- ✅ Added admin-only access control to "Add Vacancy" button in VacantPosts.tsx
- ✅ Added admin-only access control to "Add User" button in setting.tsx
- ✅ Viewers can now only view and print data, cannot create new records
- ✅ Fixed type error in resident-card.tsx (completedAt: null → undefined)
- ✅ Fixed prop naming in ResidentDetailsModal (residentId → trainerId)

**Responsive Design Fixes and Import Completion:**
- ✅ Fixed responsive layout issues in Jobs (VacantPosts) component
- ✅ Updated VacantPosts with mobile-first responsive design
- ✅ Added proper margin handling for fixed sidebar (mr-0 on mobile, mr-64 on desktop)
- ✅ Enhanced add button with icon and improved styling
- ✅ Improved table layout with better loading states and empty state messaging
- ✅ Fixed Header component to respect sidebar width on desktop (md:right-64)
- ✅ Resolved z-index conflict between Header (z-40) and Sidebar (z-50)
- ✅ Fixed trainers.filter runtime error in Residents page with proper error handling
- ✅ Added Array.isArray() checks before array operations to prevent crashes
- ✅ Completed migration import from Replit Agent to Replit environment

### October 9, 2025
**Vacancies Feature (Dynamic Jobs System):**
- ✅ Converted static vacancies section to fully dynamic database-backed system
- ✅ Created Vacancy model with Mongoose schema (name, count, date)
- ✅ Implemented complete CRUD API routes with Zod validation
- ✅ Added intelligent fallback: uses MongoDB when available, falls back to in-memory storage when disconnected
- ✅ Updated frontend VacantPosts component to use React Query for data fetching
- ✅ Integrated toast notifications for user feedback on create/error operations
- ✅ Fixed component imports in App.tsx and cleaned up sidebar imports
- ✅ All vacancy data now persists in database and survives page refreshes

### August 26, 2025
**Migration and Restructuring:**
- ✅ Successfully migrated project from Replit Agent to Replit environment
- ✅ Restructured server architecture with better organization:
  - Created `/server/models/` folder with separate model files (User.ts, Resident.ts, Teacher.ts)
  - Created `/server/controllers/` folder with UserController, ResidentController, TeacherController
  - Organized `/server/routes/` with clean route definitions using controllers
  - Removed faculty functionality as requested by user
  - Replaced faculty system with comprehensive teacher management
- ✅ Enhanced teacher form system with full validation and database persistence
- ✅ Updated shared schema to remove circular dependencies and faculty references
- ✅ Server now running successfully on port 5000 with MongoDB fallback to in-memory storage
- ✅ Implemented MVC pattern with controllers for better code organization

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing
- **TailwindCSS** for utility-first styling with custom hospital theme colors
- **shadcn/ui** component library built on Radix UI primitives for accessible UI components
- **TanStack Query** (React Query) for server state management and caching
- **React Hook Form** with Zod validation for form handling

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints
- **RESTful API design** with organized route handlers
- **Session-based authentication** using MongoDB session store
- **Replit Auth integration** for OAuth-based user authentication
- **Role-based access control** (admin/viewer permissions)
- **Middleware pattern** for request logging and error handling

### Data Layer
- **MongoDB** database for flexible document-based storage with fallback to in-memory storage
- **Mongoose ODM** for schema modeling and database operations
- **Database collections** include users, residents, faculty, forms, disciplinary actions, rewards, and sessions
- **Schema validation** using Zod for runtime type checking
- **Document-based data modeling** with embedded and referenced relationships
- **Comprehensive seeding system** with 36 faculty members across 12 departments and 14 residents
- **Department-based organization** for Internal Medicine, Surgery, Cardiology, Emergency Medicine, Pediatrics, Psychiatry, Radiology, Anesthesiology, OB/GYN, Orthopedic Surgery, Neurology, and Dermatology

### Key Features
- **Resident Management**: Complete CRUD operations for resident profiles with department assignment and status tracking
- **Training Forms System**: Nine mandatory forms (J, F, D, I, G, E, C, H, K) with completion tracking and form data storage
- **Teacher Management**: Comprehensive teacher profiles with detailed information including academic rank, appointment dates, contact details, and department assignment (replaces faculty system)
- **Vacancies Management**: Dynamic job posting system with database persistence, allowing administrators to create, view, and manage vacant positions with counts and dates
- **Disciplinary Actions & Rewards**: Tracking system for resident performance incidents and achievements
- **Reports Module**: Detailed reporting capabilities for residents, forms, disciplinary actions, rewards, and teachers
- **Authentication**: Secure OAuth integration with Replit Auth system with demo authentication fallback
- **Authorization**: Role-based permissions for admin (full access) and viewer (read-only) users
- **Teacher Form Submission**: Full validation and database persistence for teacher registration forms

### Design Patterns
- **Repository Pattern**: Storage interface abstraction for data access operations
- **Component Composition**: Reusable UI components with consistent design system
- **Hooks Pattern**: Custom React hooks for authentication and mobile detection
- **Error Boundary**: Centralized error handling with user-friendly messaging
- **Loading States**: Skeleton components and loading indicators for better UX

## External Dependencies

### Database & ODM
- **MongoDB** for document-based database storage
- **Mongoose** ODM for schema modeling and database operations

### Authentication
- **Replit Auth** OAuth provider integration
- **OpenID Connect** client for authentication flow
- **Passport.js** strategy for session management
- **connect-mongo** for MongoDB session storage

### UI Framework
- **Radix UI** primitives for accessible component foundation
- **Lucide React** for consistent icon library
- **Class Variance Authority** for component variant management
- **TailwindCSS** with PostCSS for styling pipeline

### Development Tools
- **TypeScript** for static type checking across frontend and backend
- **ESBuild** for production backend bundling
- **Vite plugins** including runtime error overlay and Replit integration
- **TSX** for TypeScript execution in development

### Utilities
- **date-fns** for date manipulation and formatting
- **nanoid** for unique ID generation
- **memoizee** for function result caching
- **clsx** and **tailwind-merge** for conditional CSS class handling