import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()} TravelGuide. Built as a free worldwide
          travel guide.
        </p>
        <div className="mt-4 pt-4 border-t border-gray-200">
           <p className="text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
             <strong>Disclaimer:</strong> All information provided on this website is derived from external APIs and public data sources for demonstrative purposes. 
             While we strive for accuracy, travel details, prices, and availability are subject to change. 
             Please verify all information with official tourism boards or providers before making travel arrangements.
           </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer