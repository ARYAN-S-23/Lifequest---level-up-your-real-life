import { useStore } from '../store';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function CalendarPage() {
  const { quests, campaigns } = useStore();

  const events = [
    ...quests.filter((q) => q.dueDate && !q.completed).map((q) => ({
      title: `${q.type === 'daily' ? '🟢' : q.type === 'weekly' ? '🟡' : '🟣'} ${q.title}`,
      date: q.dueDate!,
      color: q.type === 'daily' ? '#22c55e' : q.type === 'weekly' ? '#f59e0b' : '#8b5cf6',
    })),
    ...campaigns.filter((c) => !c.completed).map((c) => ({
      title: `${c.emoji} ${c.title}`,
      date: c.targetDate,
      color: '#ef4444',
    })),
  ];

  return (
    <div className="page-container space-y-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-cyber-muted text-sm">Track your quests and deadlines</p>
      </motion.div>

      <div className="glass rounded-xl p-5 calendar-container">
        <style>{`
          .calendar-container .fc { color: #e2e8f0; }
          .calendar-container .fc-theme-standard { background: transparent; }
          .calendar-container .fc-toolbar-title { font-size: 1.1rem; color: #e2e8f0; }
          .calendar-container .fc-button { background: #1e293b; border-color: #334155; color: #94a3b8; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; }
          .calendar-container .fc-button:hover { background: #334155; }
          .calendar-container .fc-button-active { background: #8b5cf6 !important; border-color: #8b5cf6 !important; color: white !important; }
          .calendar-container .fc-daygrid-day { background: rgba(17,24,39,0.5); }
          .calendar-container .fc-daygrid-day:hover { background: rgba(139,92,246,0.1); }
          .calendar-container .fc-col-header-cell { background: #111827; color: #94a3b8; font-size: 0.75rem; }
          .calendar-container .fc-daygrid-day-number { color: #e2e8f0; font-size: 0.85rem; }
          .calendar-container .fc-event { border-radius: 4px; padding: 2px 6px; font-size: 0.75rem; }
          .calendar-container .fc-scrollgrid { border-color: #1e293b; }
          .calendar-container .fc-scrollgrid td { border-color: #1e293b; }
        `}</style>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height={550}
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' }}
        />
      </div>
    </div>
  );
}
