//src/components/modals/ModalManager.jsx

import React, { useContext } from 'react';
import { SimulationContext } from '../../context/SimulationContext';
import DetailModal from './DetailModal';
import CompareModal from './CompareModal';
import SkyMapModal from './SkyMapModal';
import { X, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { LOCATIONS } from '../../constants/astronomyData';

export default function ModalManager() {
  const { selectedBodyId, activeBody, modalView, setModalView, skyLocation, setSkyLocation, setSelectedBodyId, userWeight, setUserWeight } = useContext(SimulationContext);

  if (!selectedBodyId || !activeBody) return null;

  const closeAll = () => {
    setSelectedBodyId(null);
    setModalView('detail');
  };

  const isCompare = modalView === 'compare';

  return (
    <div className="absolute inset-0 z-[55] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 no-drag animate-fadeIn" onClick={closeAll}>
      <div 
        className={`bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl transition-all duration-300 ease-in-out flex flex-col overflow-hidden max-h-[90vh] w-full ${
          isCompare ? 'max-w-4xl h-auto md:h-[530px]' : 'max-w-sm h-[470px] md:h-[510px] mb-16 md:mb-0'
        }`} 
        onClick={e => e.stopPropagation()}
      >
        {/* SİMETRİK HEADER */}
        <div className="flex justify-between items-center p-4 sm:p-5 pb-2 shrink-0 w-full bg-slate-900 border-b border-slate-800/60 z-10 rounded-t-3xl">
          <div className="flex-1 flex justify-start">
            {modalView !== 'detail' ? (
              <button onClick={() => setModalView('detail')} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors flex items-center gap-1 pr-3 text-xs font-medium">
                 <ArrowLeft size={14} /> Geri
              </button>
            ) : <div className="w-8"/>}
          </div>

          <div className="flex-[2] flex flex-col items-center justify-center text-center mx-1">
            {modalView === 'detail' && (
              <>
                <h2 className="text-xl font-light text-white leading-tight">{activeBody.name}</h2>
                <p className="text-indigo-400 text-[10px] font-medium uppercase tracking-wider">{activeBody.phaseName}</p>
              </>
            )}
            {modalView === 'skyMap' && (
              <select value={skyLocation.id} onChange={e => setSkyLocation(LOCATIONS.find(l => l.id === e.target.value))} className="text-sm font-medium bg-slate-800 border border-slate-700 py-1 px-3 rounded-xl text-white focus:outline-none cursor-pointer text-center appearance-none shadow-inner">
                {LOCATIONS.map(l => <option key={l.id} value={l.id} className="bg-slate-900">{l.name} ▾</option>)}
              </select>
            )}
            {modalView === 'compare' && (
              <div className="flex flex-col items-center gap-0.5 scale-90">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider font-medium">Referans Kütle (Dünya)</span>
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-0.5 shadow-inner">
                   <button onClick={() => setUserWeight(Math.max(1, userWeight - 1))} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"><ChevronLeft size={12}/></button>
                   <input type="number" value={userWeight} onChange={e => setUserWeight(Number(e.target.value))} className="w-10 bg-transparent text-white text-center text-sm font-light focus:outline-none" />
                   <span className="text-slate-500 mr-1 text-[11px]">kg</span>
                   <button onClick={() => setUserWeight(Math.min(500, userWeight + 1))} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"><ChevronRight size={12}/></button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex justify-end">
            <button onClick={closeAll} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors">
               <X size={15} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {modalView === 'detail' && <DetailModal />}
          {modalView === 'compare' && <CompareModal />}
          {modalView === 'skyMap' && <SkyMapModal />}
        </div>
      </div>
    </div>
  );
}