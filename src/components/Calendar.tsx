import { useState, useEffect } from 'react'
import './Calendar.css'

const STORAGE_KEY = 'calendar-events'

interface DayCell {
  day: number
  isCurrentMonth: boolean
  isToday: boolean
}

type EventCategory = 'work' | 'personal' | 'health' | 'social' | 'other'

interface CategoryInfo {
  label: string
  color: string
  gradient: string
}

const CATEGORIES: Record<EventCategory, CategoryInfo> = {
  work: {
    label: 'Work',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
  },
  personal: {
    label: 'Personal',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
  },
  health: {
    label: 'Health',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  social: {
    label: 'Social',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  },
  other: {
    label: 'Other',
    color: '#6b7280',
    gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
  }
}

interface Event {
  id: string
  date: string // Format: YYYY-MM-DD
  title: string
  description: string
  startTime?: string // Format: HH:MM (24-hour)
  endTime?: string // Format: HH:MM (24-hour)
  isAllDay: boolean
  category: EventCategory
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showEventDetail, setShowEventDetail] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isAllDay, setIsAllDay] = useState(true)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('personal')

  // Load events from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedEvents = JSON.parse(stored)
        setEvents(parsedEvents)
      }
    } catch (error) {
      console.error('Error loading events from localStorage:', error)
    }
  }, [])

  // Save events to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch (error) {
      console.error('Error saving events to localStorage:', error)
    }
  }, [events])

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const generateCalendarDays = (): DayCell[] => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const today = new Date()
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year

    const days: DayCell[] = []

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false
      })
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isToday: isCurrentMonth && day === today.getDate()
      })
    }

    // Next month's leading days to fill grid
    const totalCells = days.length
    const remainingCells = 42 - totalCells // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false
      })
    }

    return days
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const handleDayClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return

    const clickedDate = new Date(year, month, day)
    setSelectedDate(clickedDate)
    setShowModal(true)
  }

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventTitle.trim()) return

    if (editingEvent) {
      // Update existing event
      setEvents(events.map(event =>
        event.id === editingEvent.id
          ? {
              ...event,
              title: eventTitle.trim(),
              description: eventDescription.trim(),
              date: selectedDate ? formatDate(selectedDate) : event.date,
              isAllDay,
              startTime: isAllDay ? undefined : startTime,
              endTime: isAllDay ? undefined : endTime,
              category: selectedCategory
            }
          : event
      ))
      setEditingEvent(null)
    } else {
      // Add new event
      if (!selectedDate) return

      const newEvent: Event = {
        id: Date.now().toString(),
        date: formatDate(selectedDate),
        title: eventTitle.trim(),
        description: eventDescription.trim(),
        isAllDay,
        startTime: isAllDay ? undefined : startTime,
        endTime: isAllDay ? undefined : endTime,
        category: selectedCategory
      }

      setEvents([...events, newEvent])
    }

    setEventTitle('')
    setEventDescription('')
    setIsAllDay(true)
    setStartTime('09:00')
    setEndTime('10:00')
    setSelectedCategory('personal')
    setShowModal(false)
    setShowEventDetail(false)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId))
    setShowEventDetail(false)
    setEditingEvent(null)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setShowEventDetail(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setEventTitle(event.title)
    setEventDescription(event.description)
    setSelectedDate(new Date(event.date + 'T00:00:00'))
    setIsAllDay(event.isAllDay)
    setStartTime(event.startTime || '09:00')
    setEndTime(event.endTime || '10:00')
    setSelectedCategory(event.category)
    setShowEventDetail(false)
    setShowModal(true)
  }

  const getEventsForDay = (day: number, isCurrentMonth: boolean): Event[] => {
    if (!isCurrentMonth) return []

    const dateStr = formatDate(new Date(year, month, day))
    return events.filter(event => event.date === dateStr)
  }

  const days = generateCalendarDays()

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h1>{monthNames[month]} {year}</h1>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-grid">
        <div className="day-name">Sun</div>
        <div className="day-name">Mon</div>
        <div className="day-name">Tue</div>
        <div className="day-name">Wed</div>
        <div className="day-name">Thu</div>
        <div className="day-name">Fri</div>
        <div className="day-name">Sat</div>
        {days.map((dayCell, index) => {
          const dayEvents = getEventsForDay(dayCell.day, dayCell.isCurrentMonth)
          return (
            <div
              key={index}
              className={`day ${dayCell.isToday ? 'today' : ''} ${!dayCell.isCurrentMonth ? 'other-month' : ''}`}
              onClick={() => handleDayClick(dayCell.day, dayCell.isCurrentMonth)}
            >
              <div className="day-number">{dayCell.day}</div>
              <div className="events-container">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className="event"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEventClick(event)
                    }}
                    title="Click to view details"
                    style={{
                      background: CATEGORIES[event.category].gradient
                    }}
                  >
                    {!event.isAllDay && event.startTime && (
                      <span className="event-time-badge">{formatTime(event.startTime)}</span>
                    )}
                    <span className="event-title">{event.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => {
          setShowModal(false)
          setEditingEvent(null)
          setEventTitle('')
          setEventDescription('')
          setIsAllDay(true)
          setStartTime('09:00')
          setEndTime('10:00')
          setSelectedCategory('personal')
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingEvent ? 'Edit Event' : 'Add Event'}</h2>
            <p className="modal-date">
              {selectedDate?.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <form onSubmit={handleAddEvent}>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Event title"
                autoFocus
              />
              <textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={4}
              />
              <div className="category-selector">
                <label>Category</label>
                <div className="category-options">
                  {(Object.keys(CATEGORIES) as EventCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`category-option ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        background: CATEGORIES[cat].gradient
                      }}
                    >
                      {CATEGORIES[cat].label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="all-day-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                  />
                  All-day event
                </label>
              </div>
              {!isAllDay && (
                <div className="time-inputs">
                  <div className="time-input-group">
                    <label>Start time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="time-input-group">
                    <label>End time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <div className="modal-buttons">
                <button type="submit">{editingEvent ? 'Save Changes' : 'Add Event'}</button>
                <button type="button" onClick={() => {
                  setShowModal(false)
                  setEditingEvent(null)
                  setEventTitle('')
                  setEventDescription('')
                  setIsAllDay(true)
                  setStartTime('09:00')
                  setEndTime('10:00')
                  setSelectedCategory('personal')
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEventDetail && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowEventDetail(false)}>
          <div className="modal event-detail-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEvent.title}</h2>
            <p className="modal-date">
              {new Date(selectedEvent.date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            {!selectedEvent.isAllDay && selectedEvent.startTime && selectedEvent.endTime && (
              <p className="event-time">
                {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
              </p>
            )}
            {selectedEvent.isAllDay && (
              <p className="event-time">All-day event</p>
            )}
            <div className="event-category-badge" style={{ background: CATEGORIES[selectedEvent.category].gradient }}>
              {CATEGORIES[selectedEvent.category].label}
            </div>
            {selectedEvent.description && (
              <div className="event-description">
                <h3>Description</h3>
                <p>{selectedEvent.description}</p>
              </div>
            )}
            <div className="modal-buttons">
              <button
                type="button"
                className="edit-button"
                onClick={() => handleEditEvent(selectedEvent)}
              >
                Edit Event
              </button>
              <button
                type="button"
                className="delete-button"
                onClick={() => handleDeleteEvent(selectedEvent.id)}
              >
                Delete Event
              </button>
              <button type="button" onClick={() => setShowEventDetail(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
