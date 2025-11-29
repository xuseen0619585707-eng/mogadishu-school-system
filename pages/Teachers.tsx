import React from 'react';
import { Mail, BookOpen, Plus, Phone } from 'lucide-react';
import { MOCK_TEACHERS } from '../constants';

const Teachers: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Teaching Staff</h1>
        <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
          <Plus size={20} className="mr-2" />
          Add Teacher
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {MOCK_TEACHERS.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
               <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                     <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                        {teacher.fullName.charAt(4)}
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-900">{teacher.fullName}</h3>
                        <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">{teacher.id}</span>
                     </div>
                  </div>
               </div>
               
               <div className="space-y-3 flex-1">
                  <div className="flex items-center text-sm text-gray-600">
                     <BookOpen size={16} className="mr-3 text-gray-400" />
                     <span>{teacher.subject} Department</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                     <Mail size={16} className="mr-3 text-gray-400" />
                     <span className="truncate">{teacher.email}</span>
                  </div>
                   <div className="flex items-center text-sm text-gray-600">
                     <Phone size={16} className="mr-3 text-gray-400" />
                     <span>+252 61 555 9999</span>
                  </div>
               </div>

               <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                     <span className="font-bold text-gray-900">{teacher.classesAssigned}</span> Active Classes
                  </div>
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View Profile</button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default Teachers;