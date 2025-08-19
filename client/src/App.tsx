import React, { Suspense } from 'react';
import './App.css';
import { AppRouter } from './providers/AppRouter/ui/AppRouter';

function App() {
  return (
    <div className="app">
      <Suspense>
        <AppRouter />
      </Suspense>
    </div>
  );
}

export default App;
