import React from 'react';

const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center justify-center h-full min-h-[500px] border border-slate-700 bg-slate-800/50 rounded-xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-slate-400">This module is currently under development.</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;