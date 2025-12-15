import React, { useState, useEffect, useCallback } from 'react';
import { Event, EventType, AgendaItem, AISuggestionResponse } from './types';
import { generateEventSuggestions } from './services/geminiService';
import { CalendarIcon, MapPinIcon, SparklesIcon, PlusIcon, TrashIcon, ArrowLeftIcon, ArrowRightIcon, ClockIcon } from './components/Icons';

// --- Sub-components for cleaner App.tsx structure ---

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
    {/* Simple Navbar */}
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">EventHorizon</span>
        </div>
        {/* Optional: Simple Sign In placeholder or link */}
      </div>
    </header>

    {/* Hero Section */}
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 -mt-20">
      <div className="animate-fade-in-up">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-indigo-100 shadow-sm">
            <SparklesIcon className="w-4 h-4" />
            <span>AI-Powered Event Planning</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-tight">
          Organize moments that <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">matter</span>.
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Streamline your event organization with intelligent scheduling, automated suggestions, and beautiful itineraries.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1"
          >
            <span>Your Events</span>
            <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Feature Grid preview (Optional visual flair) */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto text-left opacity-60">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
               <SparklesIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">AI Suggestions</h3>
            <p className="text-sm text-slate-500 mt-2">Generate agendas and themes instantly.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
               <ClockIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Smart Scheduling</h3>
            <p className="text-sm text-slate-500 mt-2">Effortless timeline management.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
               <MapPinIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Beautiful Details</h3>
            <p className="text-sm text-slate-500 mt-2">Organize location and info with style.</p>
        </div>
      </div>
    </main>
    
    <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
  </div>
);

interface HeaderProps {
  onNewEvent: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewEvent }) => (
  <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
           <CalendarIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
          EventHorizon
        </h1>
      </div>
      <button
        onClick={onNewEvent}
        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
      >
        <PlusIcon className="w-4 h-4" />
        <span>New Event</span>
      </button>
    </div>
  </header>
);

interface EventCardProps {
  event: Event;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, onDelete }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: event.themeColor }}></div>
      <div className="flex justify-between items-start mb-4">
        <div>
           <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 uppercase tracking-wide">
            {event.type}
           </span>
           <h3 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-indigo-600 transition-colors">
            {event.title}
           </h3>
        </div>
        <button 
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100"
          title="Delete Event"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-slate-600 text-sm line-clamp-2 mb-4 h-10">
        {event.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-50">
        <div className="flex items-center space-x-1">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <MapPinIcon className="w-3.5 h-3.5" />
          <span>{event.location || "TBD"}</span>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const initialEvents: Event[] = [];

export default function App() {
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('eventhorizon_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });
  
  // Added 'LANDING' view state and made it the default
  const [view, setView] = useState<'LANDING' | 'LIST' | 'CREATE' | 'DETAIL'>('LANDING');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('eventhorizon_events', JSON.stringify(events));
  }, [events]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(prev => prev.filter(ev => ev.id !== id));
      if (selectedEventId === id) setView('LIST');
    }
  };

  const handleCreate = (newEvent: Event) => {
    setEvents(prev => [newEvent, ...prev]);
    setView('LIST');
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  // If view is LANDING, show LandingPage component
  if (view === 'LANDING') {
    return <LandingPage onEnter={() => setView('LIST')} />;
  }

  // Otherwise show the main app layout
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onNewEvent={() => setView('CREATE')} />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {view === 'LIST' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Your Events</h2>
              <span className="text-sm text-slate-500">{events.length} events planned</span>
            </div>
            
            {events.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No events yet</h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">Get started by planning your first event. Our AI assistant can help you organize the details.</p>
                <button 
                  onClick={() => setView('CREATE')}
                  className="inline-flex items-center space-x-2 text-indigo-600 font-semibold hover:text-indigo-800"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Create your first event</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => { setSelectedEventId(event.id); setView('DETAIL'); }}
                    onDelete={(e) => handleDelete(e, event.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'CREATE' && (
          <CreateEventView onCancel={() => setView('LIST')} onSave={handleCreate} />
        )}

        {view === 'DETAIL' && selectedEvent && (
          <EventDetailView event={selectedEvent} onBack={() => setView('LIST')} />
        )}
      </main>
    </div>
  );
}

// --- Create Event View ---

interface CreateEventViewProps {
  onCancel: () => void;
  onSave: (event: Event) => void;
}

const CreateEventView: React.FC<CreateEventViewProps> = ({ onCancel, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: EventType.MEETING,
    location: '',
    description: '',
    themeColor: '#6366f1',
    agenda: [] as AgendaItem[]
  });

  const handleAIPlanning = async () => {
    if (!formData.title || !formData.date) {
      alert("Please provide at least a title and date for the AI to suggest details.");
      return;
    }

    setLoading(true);
    try {
      const suggestions = await generateEventSuggestions(
        formData.title, 
        formData.type, 
        formData.date, 
        formData.location || "TBD"
      );
      
      setFormData(prev => ({
        ...prev,
        description: suggestions.description,
        themeColor: suggestions.themeColor,
        agenda: suggestions.agenda.map((item, idx) => ({
          id: `agenda-${Date.now()}-${idx}`,
          time: item.time,
          activity: item.activity
        }))
      }));
    } catch (err) {
      alert("Failed to generate suggestions. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!formData.title) return;
    const newEvent: Event = {
      id: Date.now().toString(),
      createdAt: Date.now(),
      ...formData
    };
    onSave(newEvent);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 flex items-center space-x-1 text-sm font-medium">
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <h2 className="text-lg font-bold text-slate-900">Plan New Event</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Input Form */}
        <div className="p-8 space-y-6 border-r border-slate-100">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Q4 Marketing Summit"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as EventType})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                placeholder="e.g. Grand Hotel Ballroom"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white"
                placeholder="Describe the purpose of the event..."
              />
            </div>
            
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Theme Color</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={formData.themeColor}
                  onChange={e => setFormData({...formData, themeColor: e.target.value})}
                  className="h-10 w-16 p-1 rounded border border-slate-300 cursor-pointer bg-white"
                />
                <span className="text-sm text-slate-500 font-mono">{formData.themeColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI & Agenda */}
        <div className="p-8 bg-slate-50 flex flex-col h-full">
           <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <SparklesIcon className="w-24 h-24 text-indigo-600" />
             </div>
             <h3 className="text-indigo-900 font-semibold flex items-center gap-2">
               <SparklesIcon className="w-5 h-5 text-indigo-600" />
               AI Assistant
             </h3>
             <p className="text-sm text-indigo-700 mt-1 mb-3">
               Fill in the basic info (Title, Date, Type) and let Gemini suggest a description, theme, and agenda for you.
             </p>
             <button
              onClick={handleAIPlanning}
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-sm ${
                loading 
                ? 'bg-indigo-300 text-white cursor-not-allowed' 
                : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300'
              }`}
             >
               {loading ? (
                 <>
                   <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                   <span>Generating Magic...</span>
                 </>
               ) : (
                 <>
                   <SparklesIcon className="w-4 h-4" />
                   <span>Auto-Generate Plan</span>
                 </>
               )}
             </button>
           </div>

           <div className="flex-1 overflow-y-auto">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-slate-800">Agenda</h3>
               <button 
                onClick={() => setFormData(prev => ({
                  ...prev, 
                  agenda: [...prev.agenda, { id: Date.now().toString(), time: '', activity: '' }]
                }))}
                className="text-xs text-indigo-600 font-medium hover:underline"
               >
                 + Add Slot
               </button>
             </div>
             
             {formData.agenda.length === 0 ? (
               <div className="text-center text-slate-400 text-sm py-8 border-2 border-dashed border-slate-200 rounded-lg">
                 Agenda is empty. <br/>Use AI or add manually.
               </div>
             ) : (
               <div className="space-y-3">
                 {formData.agenda.map((item, index) => (
                   <div key={item.id} className="flex gap-2 items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                     <input 
                       className="w-20 text-sm font-medium text-slate-700 border-b border-transparent focus:border-indigo-300 outline-none text-center"
                       placeholder="09:00"
                       value={item.time}
                       onChange={e => {
                         const newAgenda = [...formData.agenda];
                         newAgenda[index].time = e.target.value;
                         setFormData({...formData, agenda: newAgenda});
                       }}
                     />
                     <div className="h-4 w-px bg-slate-200"></div>
                     <input 
                       className="flex-1 text-sm text-slate-900 border-b border-transparent focus:border-indigo-300 outline-none"
                       placeholder="Activity..."
                       value={item.activity}
                       onChange={e => {
                         const newAgenda = [...formData.agenda];
                         newAgenda[index].activity = e.target.value;
                         setFormData({...formData, agenda: newAgenda});
                       }}
                     />
                     <button 
                      onClick={() => {
                        const newAgenda = formData.agenda.filter((_, i) => i !== index);
                        setFormData({...formData, agenda: newAgenda});
                      }}
                      className="text-slate-400 hover:text-red-500"
                     >
                       <TrashIcon className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
               </div>
             )}
           </div>

           <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end space-x-3">
             <button 
               onClick={onCancel}
               className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors"
             >
               Cancel
             </button>
             <button 
               onClick={handleSave}
               disabled={!formData.title}
               className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Create Event
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Detail View ---

interface EventDetailViewProps {
  event: Event;
  onBack: () => void;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({ event, onBack }) => {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-slate-500 hover:text-indigo-600 flex items-center space-x-2 font-medium transition-colors">
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Back to Events</span>
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="h-48 relative overflow-hidden">
           <div 
             className="absolute inset-0 opacity-90"
             style={{ backgroundColor: event.themeColor }}
           ></div>
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
           <div className="absolute bottom-0 left-0 p-8 text-white">
             <div className="flex items-center space-x-2 mb-2">
               <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider">
                 {event.type}
               </span>
               <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold flex items-center gap-1">
                 <CalendarIcon className="w-3 h-3" />
                 {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
               </span>
             </div>
             <h1 className="text-4xl font-bold">{event.title}</h1>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-indigo-500"></span>
                About this Event
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {event.description}
              </p>
              <div className="mt-4 flex items-center text-slate-500">
                <MapPinIcon className="w-5 h-5 mr-2 text-indigo-500" />
                <span className="font-medium">{event.location || "Location to be announced"}</span>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-indigo-500"></span>
                Agenda
              </h3>
              <div className="space-y-4">
                {event.agenda.length > 0 ? (
                  event.agenda.map((item, idx) => (
                    <div key={idx} className="flex group">
                      <div className="w-24 flex-shrink-0 text-right pr-4 pt-1">
                        <span className="text-sm font-bold text-slate-900 block">{item.time}</span>
                      </div>
                      <div className="relative flex-1 pb-8 last:pb-0 border-l border-indigo-100 pl-6">
                        <div className="absolute -left-[5px] top-[6px] w-2.5 h-2.5 rounded-full bg-indigo-400 ring-4 ring-white"></div>
                        <h4 className="text-base font-semibold text-slate-800">{item.activity}</h4>
                      </div>
                    </div>
                  ))
                ) : (
                   <p className="text-slate-400 italic">No agenda items scheduled.</p>
                )}
              </div>
            </section>
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Event Stats</h3>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500">Sessions</span>
                   <span className="font-semibold text-slate-900">{event.agenda.length}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500">Created</span>
                   <span className="font-semibold text-slate-900">{new Date(event.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};