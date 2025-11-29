import React, { useState, useContext } from 'react';
import { BookOpen, Plus, Award, Filter, Download } from 'lucide-react';
import { MOCK_GRADES } from '../constants';
import { AuthContext } from '../App';
import { Grade } from '../types';

const Grades: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [grades, setGrades] = useState<Grade[]>(MOCK_GRADES);
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  
  const canEdit = user?.role === 'Admin' || user?.role === 'Teacher' || user?.role === 'Principal';

  // If student/parent, only show their grades
  const filteredGrades = grades.filter(g => {
      const termMatch = g.term === selectedTerm;
      if (user?.role === 'Student' || user?.role === 'Parent') {
         // In a real app, we'd filter by ID. For demo, we just show all or filter if we had user.studentId
         return termMatch; 
      }
      return termMatch;
  });

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-700';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Results & Grading</h1>
          <p className="text-gray-500">Manage student performance and report cards.</p>
        </div>
        <div className="flex space-x-3">
           <div className="bg-white border border-gray-200 rounded-lg flex items-center px-3 py-2">
              <Filter size={16} className="text-gray-400 mr-2" />
              <select 
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm font-medium text-gray-700"
              >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
              </select>
           </div>
           {canEdit && (
               <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
                  <Plus size={18} className="mr-2" />
                  Add Grade
               </button>
           )}
        </div>
      </div>

      {/* Stats Cards for Grades */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-indigo-100 font-medium">Class Average</p>
                   <h3 className="text-3xl font-bold mt-1">82.4%</h3>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                   <Award className="text-white" size={24} />
                </div>
             </div>
             <p className="mt-4 text-sm text-indigo-100 flex items-center">
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-white mr-2">+2.4%</span> since last term
             </p>
          </div>
          
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-gray-500 font-medium">Top Performer</p>
                   <h3 className="text-xl font-bold text-gray-900 mt-1">Fatuma Ali</h3>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                   <Award className="text-yellow-600" size={24} />
                </div>
             </div>
             <p className="mt-4 text-sm text-gray-400">
                Grade 10A • 99% Math
             </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-gray-500 font-medium">Papers Graded</p>
                   <h3 className="text-2xl font-bold text-gray-900 mt-1">1,240</h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                   <BookOpen className="text-blue-600" size={24} />
                </div>
             </div>
             <p className="mt-4 text-sm text-green-600 font-medium">
                100% complete
             </p>
          </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
           <h3 className="font-bold text-gray-800">Student Marks Record</h3>
           <button className="text-sm text-gray-500 hover:text-indigo-600 flex items-center">
              <Download size={16} className="mr-1" /> Export CSV
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-semibold">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Remarks</th>
                {canEdit && <th className="px-6 py-4 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGrades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{grade.studentName}</td>
                  <td className="px-6 py-4">
                     <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 text-xs font-bold">{grade.classId}</span>
                  </td>
                  <td className="px-6 py-4">{grade.subject}</td>
                  <td className="px-6 py-4 font-mono font-medium text-gray-800">{grade.score}/100</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getGradeColor(grade.grade)}`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 italic">
                    "{grade.remarks}"
                  </td>
                  {canEdit && (
                     <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Edit</button>
                     </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Grades;
