
import React from 'react';
import type { Plugin } from '../types';
import * as math from 'mathjs';

export const calcPlugin: Plugin = {
  name: 'calc',
  match: (input) => input.startsWith('/calc '),
  execute: (input) => {
    const expr = input.replace('/calc ', '').trim();
    try {
      const result = math.evaluate(expr);
      return typeof result === 'number' ? { result } : { error: 'Invalid expression' };
    } catch {
      return { error: 'Calculation failed' };
    }
  },
  render: (data) => (
    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
      {data.error ? (
        <span className="text-red-500"> {data.error}</span>
      ) : (
        <span>✅ Result: <strong>{data.result}</strong></span>
      )}
    </div>
  )
};