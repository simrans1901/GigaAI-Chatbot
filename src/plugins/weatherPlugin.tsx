
import React from 'react';
import type { Plugin } from '../types';

export const weatherPlugin: Plugin = {
  name: 'weather',
  match: (input) => input.startsWith('/weather '),
  execute: async (input) => {
    const city = input.replace('/weather ', '').trim();
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b372b98b2097018ecb8f8a7a421b9e5d&units=metric`
      );
      const data = await response.json();
      return {
        city: data.name,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon
      };
    } catch (error) {
      return { error: 'Failed to fetch weather' };
    }
  },
  render: (data) => (
    <div className="bg-blue-50 p-3 rounded border border-blue-200">
      {data.error ? (
        <span className="text-red-500"> {data.error}</span>
      ) : (
        <div className="flex items-center gap-3">
          {data.icon && (
            <img 
              src={`https://openweathermap.org/img/wn/${data.icon}.png`} 
              alt="Weather icon"
              className="w-10 h-10"
            />
          )}
          <div>
            <h3 className="font-bold">Weather in {data.city}</h3>
            <p>{data.temp}°C • {data.description}</p>
          </div>
        </div>
      )}
    </div>
  )
};