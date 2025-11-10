export const EventAPI = (() => {
    const STORAGE_KEY = 'plannedEvents';

    /**
     * Generate a unique ID string
     * Uses timestamp + random string to minimize collision probability
     * @returns {string} Unique identifier
     */
    const generateUniqueId = () => {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 9);
        return `${timestamp}-${randomStr}`;
    };

    /**
     * Get all events from localStorage
     * @returns {Array} Array of event objects
     */
    const getAllEventsFromStorage = () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    };

    /**
     * Save events to localStorage
     * @param {Array} events - Array of event objects to save
     */
    const saveEventsToStorage = (events) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            throw new Error('Failed to save events to localStorage');
        }
    };

    /**
     * Sort events by time (ascending order)
     * @param {Array} events - Array of events to sort
     * @returns {Array} Sorted array of events
     */
    const sortEventsByTime = (events) => {
        return events.sort((a, b) => {
            // Compare by date first, then by time
            if (a.date !== b.date) {
                return new Date(a.date) - new Date(b.date);
            }
            // If dates are equal, compare by time
            return a.time.localeCompare(b.time);
        });
    };

    /**
     * Add a new event to localStorage
     * @param {string} date
     * @param {string} time
     * @param {string} name
     * @param {string} category
     * @returns {Object} The newly created event object
     */
    const addEvent = (date, time, name, category) => {
        // Validate inputs
        if (!date || !time || !name || !category) {
            throw new Error('All parameters (date, time, name, category) are required');
        }

        const events = getAllEventsFromStorage();
        
        const newEvent = {
            id: generateUniqueId(),
            date: date,
            time: time,
            name: name,
            category: category,
            isCompleted: false,
            points: 0
        };

        events.push(newEvent);
        saveEventsToStorage(events);
        
        return newEvent;
    };

    /**
     * Get all events organized by time
     * @returns {Array} Array of events sorted by date and time
     */
    const getEvents = () => {
        const events = getAllEventsFromStorage();
        return sortEventsByTime(events);
    };

    /**
     * Complete an event by updating its time, points, and isCompleted status
     * @param {string} event_id
     * @param {string} time
     * @param {number} points
     * @returns {Object|null}
     */
    
    const completeEvent = (event_id, time, points) => {
        // Validate inputs
        if (!event_id) {
            throw new Error('event_id is required');
        }
        if (time === undefined || time === null) {
            throw new Error('time is required');
        }
        if (points === undefined || points === null) {
            throw new Error('points is required');
        }

        // Validate points range
        const numericPoints = Number(points);
        if (isNaN(numericPoints) || numericPoints < -3 || numericPoints > 3) {
            throw new Error('points must be a number between -3 and 3');
        }

        const events = getAllEventsFromStorage();
        const eventIndex = events.findIndex(event => event.id === event_id);

        if (eventIndex === -1) {
            console.warn(`Event with id "${event_id}" not found`);
            return null;
        }

        // Update the event
        events[eventIndex].time = time;
        events[eventIndex].points = numericPoints;
        events[eventIndex].isCompleted = true;

        saveEventsToStorage(events);
        
        return events[eventIndex];
    };

    /**
     * Delete an event from localStorage
     * @param {string} event_id - The unique ID of the event to delete
     * @returns {boolean} True if deleted, false if not found
     */
    const deleteEvent = (event_id) => {
        if (!event_id) {
            throw new Error('event_id is required');
        }

        const events = getAllEventsFromStorage();
        const initialLength = events.length;
        const filteredEvents = events.filter(event => event.id !== event_id);

        if (filteredEvents.length === initialLength) {
            console.warn(`Event with id "${event_id}" not found`);
            return false;
        }

        saveEventsToStorage(filteredEvents);
        return true;
    };

    // Public API
    return {
        addEvent,
        getEvents,
        completeEvent,
        deleteEvent
    };
})();