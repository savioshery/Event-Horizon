export enum EventType {
  CONFERENCE = 'Conference',
  PARTY = 'Party',
  MEETING = 'Meeting',
  WORKSHOP = 'Workshop',
  WEDDING = 'Wedding',
  OTHER = 'Other'
}

export interface AgendaItem {
  id: string;
  time: string;
  activity: string;
  notes?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: EventType;
  description: string;
  agenda: AgendaItem[];
  themeColor: string; // Hex code
  createdAt: number;
}

export interface AISuggestionResponse {
  description: string;
  agenda: { time: string; activity: string }[];
  themeColor: string;
  tagline: string;
}
