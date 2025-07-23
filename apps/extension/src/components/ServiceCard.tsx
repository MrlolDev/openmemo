import React from 'react';
import type { Service } from '../config/services';

interface ServiceCardProps {
  service: Service;
  isSupported: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSupported }) => {
  return (
    <div
      className={`group relative p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300 hover:bg-white/8 hover:border-white/20 ${
        !isSupported ? 'opacity-75' : ''
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          isSupported
            ? 'from-[#A8FF00]/5'
            : 'from-[#00bfff]/5'
        } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
      />
      <div className="relative flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
            isSupported ? 'glow-sm' : ''
          }`}
          style={{
            backgroundColor: `${service.color}20`,
            color: service.color,
            ...(isSupported && { boxShadow: `0 0 20px ${service.color}30` }),
          }}
        >
          {service.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h5
              className={`font-medium text-sm ${
                isSupported ? 'text-white' : 'text-white/80'
              }`}
            >
              {service.name}
            </h5>
            <div
              className={`px-2 py-0.5 text-xs font-medium rounded-lg ${
                isSupported
                  ? 'bg-[#A8FF00]/20 text-[#A8FF00]'
                  : 'bg-[#00bfff]/20 text-[#00bfff]'
              }`}
            >
              {isSupported ? '✓ Active' : 'Coming Soon'}
            </div>
          </div>
          <p
            className={`text-xs leading-relaxed ${
              isSupported ? 'text-white/60' : 'text-white/50'
            }`}
          >
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;