import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, FileText, Loader, X, Save, User, MapPin, Phone } from 'lucide-react';
import { generateStudentReport } from '../services/geminiService';

// Define the shape of a Student locally to match Database
interface Student {
  id: number | string;
  fullName: string;
  class: string;
  gender: 'Male' | 'Female';
  status: string;
  attendance: number;
  dob?: string;
  phone?: string;
  address?: string;
  parentContact?: string;
  lastPerformanceReview?: string;
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [report, setReport] = useState<string>('');
  const [loadingReport, setLoadingReport] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  
  // Registration Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    gender: 'Male',
    status: 'Active',
    attendance: 100,
  });

  // --- 1. FETCH STUDENTS FROM DATABASE ---
  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8081/students');
      const data = await response.json();
      
      // Map Database Snake_case to Frontend CamelCase
      const formattedData = data.map((item: any) => ({
        id: item.id,
        fullName: item.full_name, 
        class: item.class,
        gender: item.gender,
        status: 'Active', 
        attendance: 100,  
        phone: item.phone,
        address: item.address,
        lastPerformanceReview: 'No review yet'
      }));

      setStudents(formattedData);
      setLoadingData(false);
    } catch (err) {
      console.error("Error fetching students:", err);
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateReport = async (student: Student) => {
    setSelectedStudent(student);
    setLoadingReport(true);
    setReport('');
    
    const reportStudent = { ...student, name: student.fullName, grade: student.class };
    
    // FIX: Added 'as any' to solve the red line error
    const result = await generateStudentReport(reportStudent as any);
    
    setReport(result);
    setLoadingReport(false);
  };

  const closeReportModal = () => {
    setSelectedStudent(null);
    setReport('');
  };

  // --- 2. HANDLE REGISTRATION (SAVE TO DB) ---
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const response = await fetch('http://localhost:8081/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });
        
        const result = await response.json();

        if (result.status === 'Success') {
            fetchStudents(); // Refresh list
            setIsRegisterOpen(false);
            setNewStudent({ gender: 'Male', status: 'Active', attendance: 100 });
        } else {
            alert("Error saving student");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Server error");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Students Directory</h1>
        <button 
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        >
          <Plus size={20} className="mr-2" />
          Register New Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or grade..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-semibold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Gender</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingData ? (
                  <tr><td colSpan={7} className="p-8 text-center">Loading Data...</td></tr>
              ) : filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-400">#{student.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{student.fullName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 text-xs font-bold">{student.class}</span>
                  </td>
                   <td className="px-6 py-4">
                    <span className="text-gray-600">{student.gender}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.status === 'Active'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full mr-2 overflow-hidden">
                        <div 
                           className={`h-full rounded-full ${student.attendance >= 90 ? 'bg-green-500' : student.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                           style={{ width: `${student.attendance}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                       <button 
                         onClick={() => handleGenerateReport(student)}
                         className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center group"
                         title="Generate AI Report"
                       >
                         <FileText size={18} />
                         <span className="ml-1 text-xs font-medium hidden group-hover:inline-block">Report</span>
                       </button>
                       <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                         <MoreVertical size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loadingData && filteredStudents.length === 0 && (
          <div className="p-8 text-center text-gray-400">No students found in database.</div>
        )}
      </div>

      {/* AI Report Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeReportModal}></div>
           <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
                 <div>
                    <h3 className="text-lg font-bold text-indigo-900">AI Student Report</h3>
                    <p className="text-sm text-indigo-600">Generating insights for {selectedStudent.fullName}</p>
                 </div>
                 <button onClick={closeReportModal} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/50 transition-colors">
                    <X size={20} />
                 </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                 {loadingReport ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                       <Loader className="animate-spin text-indigo-600" size={32} />
                       <p className="text-sm text-gray-500 animate-pulse">Analyzing performance data...</p>
                    </div>
                 ) : (
                    <div className="space-y-4">
                       <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                          <strong>Performance Note:</strong> {selectedStudent.lastPerformanceReview}
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Generated Report</h4>
                          <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                             {report}
                          </p>
                       </div>
                       <div className="flex justify-end pt-4">
                          <button 
                             onClick={closeReportModal}
                             className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                             Close & Save
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Registration Modal */}
      {isRegisterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsRegisterOpen(false)}></div>
              <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                      <div>
                          <h3 className="text-xl font-bold text-gray-900">Student Registration</h3>
                          <p className="text-sm text-gray-500">Add a new student to the database</p>
                      </div>
                      <button onClick={() => setIsRegisterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <X size={20} className="text-gray-500" />
                      </button>
                  </div>
                  
                  <form onSubmit={handleRegisterSubmit} className="p-6 space-y-6">
                      <div className="space-y-4">
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center">
                              <User size={16} className="mr-2" /> Personal Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                  <input 
                                    required
                                    type="text" 
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="e.g. Ali Ahmed"
                                    value={newStudent.fullName || ''}
                                    onChange={e => setNewStudent({...newStudent, fullName: e.target.value})}
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                  <input 
                                    type="date" 
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    value={newStudent.dob || ''}
                                    onChange={e => setNewStudent({...newStudent, dob: e.target.value})}
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                  <select 
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    value={newStudent.gender}
                                    onChange={e => setNewStudent({...newStudent, gender: e.target.value as 'Male' | 'Female'})}
                                  >
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                  </select>
                              </div>
                               <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                  <input 
                                    required
                                    type="text" 
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="e.g. 10A"
                                    value={newStudent.class || ''}
                                    onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-50">
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center">
                              <Phone size={16} className="mr-2" /> Contact Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                  <input 
                                    type="tel" 
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="+252 61..."
                                    value={newStudent.phone || ''}
                                    onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Contact</label>
                                  <input 
                                    required
                                    type="tel" 
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Emergency Contact"
                                    value={newStudent.parentContact || ''}
                                    onChange={e => setNewStudent({...newStudent, parentContact: e.target.value})}
                                  />
                              </div>
                              <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><MapPin size={14} className="mr-1"/> Address</label>
                                  <input 
                                    type="text" 
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="District, Street..."
                                    value={newStudent.address || ''}
                                    onChange={e => setNewStudent({...newStudent, address: e.target.value})}
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3">
                          <button 
                             type="button"
                             onClick={() => setIsRegisterOpen(false)}
                             className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium rounded-xl transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                             type="submit"
                             disabled={isSubmitting}
                             className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center"
                          >
                             {isSubmitting ? <Loader className="animate-spin" /> : <><Save size={18} className="mr-2" /> Register Student</>}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Students;