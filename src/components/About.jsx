import React from 'react';
import { useInView } from '../hooks/useInView'; // we'll move the hook to a separate file

const About = ({ darkMode }) => {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={`min-h-screen p-8 transition-all duration-700 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-indigo-50 text-gray-800'} ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      <div className="max-w-4xl mx-auto py-12">
        <h2 className="text-4xl font-bold mb-8 text-center">About Me</h2>
        <div className={`p-8 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <p className="mb-4">
            Hi, I'm <span className="font-semibold text-indigo-500">Anjali Shukla</span> — a passionate CA Finalist.
          </p>
          <p className="mb-4">Graduated from Patliputra University (2023) and completed Orientation & IT Training.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
