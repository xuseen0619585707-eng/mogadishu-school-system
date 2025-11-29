export type UserRole = 'Admin' | 'Principal' | 'Teacher' | 'Student' | 'Accountant' | 'Reception' | 'Parent';

export interface User {
  id?: number;
  username: string;
  role: UserRole;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Student {
  id: string; // Mapped to INT in DB, but string often easier for UI IDs like ST001
  fullName: string; // SQL: full_name
  dob?: string;
  gender: 'Male' | 'Female';
  class: string;
  email?: string;
  phone?: string;
  address?: string;
  parentId?: number;
  
  // UI helpers not in DB
  attendance: number; 
  status: 'Active' | 'Inactive';
  parentContact: string; // helper for UI
  lastPerformanceReview?: string;
  feesPaid?: boolean;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  
  // UI helpers
  classesAssigned: number;
}

export interface Grade {
  id: number;
  studentId: string;
  studentName: string; // Helper for UI
  classId: string;
  subject: string;
  grade: string; // A, B, C...
  score: number; // 0-100
  term: string;
  remarks?: string;
}

export interface Fee {
  id: number;
  studentId: string;
  studentName: string; // Helper for UI
  type: 'Tuition' | 'Transport' | 'Exam' | 'Library';
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  paymentDate?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  avgAttendance: number;
  revenue: number;
}

export const PERMISSIONS: Record<UserRole, string[]> = {
  Admin: ['Dashboard', 'Students', 'Teachers', 'Attendance', 'Grades', 'Fees', 'Documents', 'Reports', 'Settings'],
  Principal: ['Dashboard', 'Students', 'Teachers', 'Attendance', 'Grades', 'Fees', 'Documents', 'Reports'],
  Teacher: ['Dashboard', 'Students', 'Attendance', 'Grades', 'Documents'],
  Student: ['Dashboard', 'Grades', 'Documents', 'Fees'], // Added Fees for viewing
  Accountant: ['Dashboard', 'Fees', 'Reports', 'Students'],
  Reception: ['Dashboard', 'Students'],
  Parent: ['Dashboard', 'Grades', 'Fees', 'Documents'],
};
