
import React from 'react';
import type { Plugin } from '../types';

export const dictPlugin: Plugin = {
  name: 'define',
  match: (input) => input.startsWith('/define ') || input.startsWith('define '),
  execute: async (input) => {
    const word = input.replace(/^\/define\s+|^define\s+/i, '').trim();
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) throw new Error('Word not found');
      
      const data = await response.json();
      const definition = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;
      
      if (!definition) throw new Error('Definition not available');
      
      return {
        word,
        definition,
        partOfSpeech: data[0]?.meanings?.[0]?.partOfSpeech || ''
      };
    } catch (error) {
      return { 
        error: `Couldn't find definition for "${word}". Try another word.`,
        word
      };
    }
  },
  render: (data) => (
    <div className="space-y-1">
      {data.error ? (
        <div className="text-red-500">{data.error}</div>
      ) : (
        <>
          <div className="font-semibold">Definition of <span className="text-blue-600">{data.word}</span>:</div>
          {data.partOfSpeech && (
            <div className="text-sm text-gray-500 italic">{data.partOfSpeech}</div>
          )}
          <div className="text-gray-700">{data.definition}</div>
        </>
      )}
    </div>
  )
};