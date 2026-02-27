// This file contains the render functions for utility features
// Copy these functions before the return statement in App.tsx

  const renderSchedule = () => (
    <div className=\"min-h-screen bg-[#0a0502] text-gray-200 p-6 md:p-12\">
      <div className=\"max-w-6xl mx-auto\">
        <div className=\"flex items-center justify-between mb-8\">
          <h1 className=\"text-4xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text\">Class Schedule</h1>
          <button onClick={() => setView('dashboard')} className=\"p-2 rounded-lg hover:bg-white/10 transition-colors\"><X size={24} /></button>
        </div>\n        \n        <div className=\"mb-6 flex gap-4 flex-col sm:flex-row\">
          <div className=\"flex-1\">
            <input\n              type=\"text\"\n              placeholder=\"Search by course code or name...\"\n              value={scheduleFilter}\n              onChange={(e) => setScheduleFilter(e.target.value)}\n              className=\"w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500\"\n            />\n          </div>\n        </div>\n\n        <div className=\"grid gap-4\">
          {(schedules.length > 0 ? schedules : generateMockSchedules()).filter(s => \n            s.courseName.toLowerCase().includes(scheduleFilter.toLowerCase()) || \n            s.courseCode.toLowerCase().includes(scheduleFilter.toLowerCase())\n          ).map(schedule => (\n            <div key={schedule.id} className=\"bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors\">
              <div className=\"flex justify-between items-start mb-3\">
                <div>\n                  <div className=\"flex items-center gap-2 mb-1\">
                    <span className=\"text-sm font-mono text-amber-400\">{schedule.courseCode}</span>\n                    <span className=\"text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full\">Course</span>\n                  </div>\n                  <h3 className=\"text-lg font-bold text-white\">{schedule.courseName}</h3>\n                </div>\n              </div>\n              <div className=\"space-y-2 text-sm\">
                <p><span className=\"text-gray-400\">Instructor:</span> {schedule.instructor}</p>\n                <p><span className=\"text-gray-400\">Schedule:</span> {schedule.day} @ {schedule.time}</p>\n                <p><span className=\"text-gray-400\">Room:</span> {schedule.location}</p>\n              </div>\n            </div>\n          ))}\n        </div>\n      </div>\n    </div>\n  );