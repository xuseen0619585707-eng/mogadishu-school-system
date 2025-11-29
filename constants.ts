import { Student, Teacher, Grade, Fee } from './types';

export const HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2670&auto=format&fit=crop',
    title: 'Excellence in Education',
    subtitle: 'Shaping the future of Mogadishu through modern learning.'
  },
  {
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2686&auto=format&fit=crop',
    title: 'World-Class Facilities',
    subtitle: 'State of the art labs and classrooms for our students.'
  },
  {
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2604&auto=format&fit=crop',
    title: 'Empowering Teachers',
    subtitle: 'Providing the tools needed for next-generation guidance.'
  },
  {
    url: 'https://images.unsplash.com/photo-1427504746696-ea5abd7dfe8b?q=80&w=2600&auto=format&fit=crop',
    title: 'Community & Growth',
    subtitle: 'Building a strong community of parents, students, and staff.'
  }
];

export const MOCK_STUDENTS: Student[] = [
  { id: 'ST001', fullName: 'Abdi Hassan', gender: 'Male', class: '10A', attendance: 92, status: 'Active', parentContact: '+252 61 555 0101', phone: '+252 61 500 0001', address: 'Wadajir, Mogadishu', lastPerformanceReview: 'Excellent in Mathematics, needs improvement in History.', feesPaid: true },
  { id: 'ST002', fullName: 'Fatuma Ali', gender: 'Female', class: '10A', attendance: 98, status: 'Active', parentContact: '+252 61 555 0102', phone: '+252 61 500 0002', address: 'Hodan, Mogadishu', lastPerformanceReview: 'Consistently top of the class.', feesPaid: true },
  { id: 'ST003', fullName: 'Mohamed Farah', gender: 'Male', class: '11B', attendance: 85, status: 'Active', parentContact: '+252 61 555 0103', phone: '+252 61 500 0003', address: 'Hamar Weyne, Mogadishu', lastPerformanceReview: 'Good participation, but homework submission is irregular.', feesPaid: false },
  { id: 'ST004', fullName: 'Asha Ibrahim', gender: 'Female', class: '9C', attendance: 78, status: 'Active', parentContact: '+252 61 555 0104', phone: '+252 61 500 0004', address: 'Yaqshid, Mogadishu', lastPerformanceReview: 'Struggling with focus during science labs.', feesPaid: true },
  { id: 'ST005', fullName: 'Khalid Omar', gender: 'Male', class: '12A', attendance: 95, status: 'Active', parentContact: '+252 61 555 0105', phone: '+252 61 500 0005', address: 'Warta Nabada, Mogadishu', lastPerformanceReview: 'Showing great leadership skills in sports.', feesPaid: false },
  { id: 'ST006', fullName: 'Hodan Yusuf', gender: 'Female', class: '10B', attendance: 88, status: 'Inactive', parentContact: '+252 61 555 0106', phone: '+252 61 500 0006', address: 'Daynile, Mogadishu', lastPerformanceReview: 'Transferred out mid-term.', feesPaid: true },
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 'T001', fullName: 'Mr. Ahmed', subject: 'Mathematics', classesAssigned: 5, email: 'ahmed@mss.edu.so', phone: '+252 61 555 9991' },
  { id: 'T002', fullName: 'Ms. Leyla', subject: 'English', classesAssigned: 4, email: 'leyla@mss.edu.so', phone: '+252 61 555 9992' },
  { id: 'T003', fullName: 'Mr. Guled', subject: 'Physics', classesAssigned: 3, email: 'guled@mss.edu.so', phone: '+252 61 555 9993' },
  { id: 'T004', fullName: 'Ms. Safia', subject: 'History', classesAssigned: 6, email: 'safia@mss.edu.so', phone: '+252 61 555 9994' },
];

export const MOCK_GRADES: Grade[] = [
  { id: 1, studentId: 'ST001', studentName: 'Abdi Hassan', classId: '10A', subject: 'Mathematics', grade: 'A', score: 95, term: 'Term 1', remarks: 'Outstanding' },
  { id: 2, studentId: 'ST001', studentName: 'Abdi Hassan', classId: '10A', subject: 'English', grade: 'B+', score: 88, term: 'Term 1', remarks: 'Good effort' },
  { id: 3, studentId: 'ST002', studentName: 'Fatuma Ali', classId: '10A', subject: 'Mathematics', grade: 'A+', score: 99, term: 'Term 1', remarks: 'Top of class' },
  { id: 4, studentId: 'ST003', studentName: 'Mohamed Farah', classId: '11B', subject: 'Physics', grade: 'C', score: 72, term: 'Term 1', remarks: 'Needs revision' },
  { id: 5, studentId: 'ST004', studentName: 'Asha Ibrahim', classId: '9C', subject: 'Science', grade: 'B', score: 82, term: 'Term 1', remarks: 'Steady improvement' },
  { id: 6, studentId: 'ST001', studentName: 'Abdi Hassan', classId: '10A', subject: 'Physics', grade: 'A-', score: 91, term: 'Term 1', remarks: 'Excellent' },
];

export const MOCK_FEES: Fee[] = [
  { id: 101, studentId: 'ST001', studentName: 'Abdi Hassan', type: 'Tuition', amount: 150, status: 'Paid', dueDate: '2025-01-31', paymentDate: '2025-01-25' },
  { id: 102, studentId: 'ST003', studentName: 'Mohamed Farah', type: 'Tuition', amount: 150, status: 'Overdue', dueDate: '2025-01-31' },
  { id: 103, studentId: 'ST005', studentName: 'Khalid Omar', type: 'Tuition', amount: 150, status: 'Pending', dueDate: '2025-02-28' },
  { id: 104, studentId: 'ST002', studentName: 'Fatuma Ali', type: 'Transport', amount: 50, status: 'Paid', dueDate: '2025-02-01', paymentDate: '2025-01-30' },
  { id: 105, studentId: 'ST001', studentName: 'Abdi Hassan', type: 'Exam', amount: 20, status: 'Paid', dueDate: '2025-02-15', paymentDate: '2025-02-10' },
];

export const DASHBOARD_STATS = {
  totalStudents: 1240,
  totalTeachers: 45,
  avgAttendance: 94.2,
  revenue: 154000,
};
