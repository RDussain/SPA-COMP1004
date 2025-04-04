document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const habitNameInput = document.getElementById('habitNameInput');
    const habitTimeInput = document.getElementById('habitTimeInput');
    const addHabitBtn = document.getElementById('addHabitBtn');
    const habitList = document.getElementById('habitList');
    const errorMessage = document.getElementById('error-message');
    const noHabitsMessage = document.getElementById('no-habits-message');
    const calendarView = document.getElementById('calendarView');
    const clearTasksBtn = document.getElementById('clearTasksBtn'); // Get reference

    // Constants
    const APPROACHING_THRESHOLD_MINUTES = 30;
    const CALENDAR_DAYS_TO_SHOW = 7;

    // Global State
    let habits = []; // Stores all habits across all days

    // --- Utility Functions ---
    function getTodayString() {
        // Consistent date string format for comparisons
        const today = new Date();
        // Ensure the format doesn't include time zone variations causing mismatch
        return new Date(today.getFullYear(), today.getMonth(), today.getDate()).toDateString();
    }

    // --- Local Storage ---
    function saveHabits() {
        localStorage.setItem('habitTrackerData', JSON.stringify(habits));
    }

    function loadHabits() {
        const storedData = localStorage.getItem('habitTrackerData');
        if (storedData) {
            try {
                 habits = JSON.parse(storedData);
                 if (!Array.isArray(habits)) {
                     console.warn("Stored data is not an array, resetting.");
                     habits = [];
                     localStorage.removeItem('habitTrackerData');
                 }
                 // Optional: Data cleanup if needed (e.g., ensure required fields exist)
                 habits = habits.filter(h => h.id && h.name && h.time && h.addedDate);

            } catch (e) {
                console.error("Error parsing habits from localStorage:", e);
                habits = [];
                localStorage.removeItem('habitTrackerData');
            }
        } else {
            habits = [];
        }
        renderTodaysHabits(); // Render list for today
        renderCalendar();     // Render the historical calendar
        updateClearButtonState(); // Set initial state of the clear button
    }

    // --- Habit Logic ---
    function addHabit() {
        const name = habitNameInput.value.trim();
        const time = habitTimeInput.value; // Format "HH:MM"

        if (!name || !time) {
            errorMessage.textContent = 'Please enter both habit name and target time.';
            errorMessage.style.display = 'block';
            return;
        }
        errorMessage.style.display = 'none';

        const todayString = getTodayString();

        // Prevent adding duplicate habit+time for the *same day*
        const exists = habits.some(h => h.name === name && h.time === time && h.addedDate === todayString);
        if(exists) {
            errorMessage.textContent = 'This exact habit and time already exists for today.';
            errorMessage.style.display = 'block';
            return;
        }

        const newHabit = {
            id: Date.now() + Math.random(), // Add random number for better uniqueness chance
            name: name,
            time: time,
            completed: false,
            addedDate: todayString // Store the date string it was added
        };

        habits.push(newHabit);
        saveHabits();
        renderTodaysHabits();
        renderCalendar();
        updateClearButtonState(); // Update button state after adding

        // Clear inputs
        habitNameInput.value = '';
        habitTimeInput.value = '';
    }

    function toggleComplete(id) {
         const habitIndex = habits.findIndex(habit => habit.id === id);
        if (habitIndex > -1) {
            habits[habitIndex].completed = !habits[habitIndex].completed;
            saveHabits();
            renderTodaysHabits(); // Re-render today's list
            renderCalendar(); // Re-render calendar on completion change
            // Clear button state doesn't change when toggling completion
        }
    }

    // Function to remove all habits scheduled for today
    function clearTodaysTasks() {
        const todayString = getTodayString();
        const tasksExist = habits.some(h => h.addedDate === todayString);

        if (!tasksExist) {
            console.log("No tasks for today to clear.");
            return; // Exit if no tasks to clear
        }

        // Confirmation dialog before deleting
        if (window.confirm("Are you sure you want to remove all tasks scheduled for today? This cannot be undone.")) {
            // Keep habits that were NOT added today
            habits = habits.filter(habit => habit.addedDate !== todayString);
            saveHabits(); // Save the filtered list
            renderTodaysHabits(); // Update the list view (will be empty)
            renderCalendar(); // Update the calendar view (today's % will reset or change)
            updateClearButtonState(); // Disable the button as there are no tasks now
            console.log("Today's tasks cleared.");
        } else {
            console.log("Clear tasks cancelled.");
        }
    }

    // Function to enable/disable the "Clear Today" button based on task existence
    function updateClearButtonState() {
         const todayString = getTodayString();
         const tasksExistToday = habits.some(h => h.addedDate === todayString);
         clearTasksBtn.disabled = !tasksExistToday; // Disable if no tasks exist for today
    }


    // Determines the display status (color) of a habit item
    function getHabitStatus(habit, now) {
        // Completed status takes precedence
        if (habit.completed) {
            return 'completed'; // Will be Green, crossed off
        }

        // Time Comparison (only relevant if not completed)
        const [hours, minutes] = habit.time.split(':').map(Number);
        const targetTime = new Date(now); // Use current date for comparison basis
        // Important: Ensure we're comparing against the *habit's added date's* version of the time,
        // But for status checking, we use *today's* date with the habit's time.
        targetTime.setHours(hours, minutes, 0, 0);

        const diffMinutes = (targetTime - now) / (1000 * 60); // Difference in minutes

        if (now > targetTime) {
            return 'missed'; // Red
        } else if (diffMinutes <= APPROACHING_THRESHOLD_MINUTES) {
            return 'approaching'; // Yellow
        } else {
            // More than 30 mins away, not completed, not missed = Pending/Ready
            return 'pending'; // Will be Green (new default)
        }
    }


    // --- Rendering ---

    // Renders ONLY today's habits to the main list
    function renderTodaysHabits() {
        habitList.innerHTML = ''; // Clear existing list
        const now = new Date();
        const todayString = getTodayString();

        // Filter habits for today ONLY
        const todayHabits = habits.filter(habit => habit.addedDate === todayString);

        if (todayHabits.length === 0) {
            noHabitsMessage.style.display = 'block'; // Show 'no habits' message
        } else {
            noHabitsMessage.style.display = 'none'; // Hide 'no habits' message

            // Sort today's habits by time
            todayHabits.sort((a, b) => a.time.localeCompare(b.time));

            todayHabits.forEach(habit => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center habit-item';
                li.dataset.id = habit.id;

                const status = getHabitStatus(habit, now);
                let bgColorClass = 'bg-success'; // Default: Pending (Green)
                let textColorClass = 'text-white';

                switch (status) {
                    case 'completed':
                        bgColorClass = 'bg-success'; // Still green
                        li.classList.add('completed'); // Add class for line-through
                        break;
                    case 'missed':
                        bgColorClass = 'bg-danger';
                        break;
                    case 'approaching':
                        bgColorClass = 'bg-warning';
                        textColorClass = 'text-dark'; // Better contrast on yellow
                        break;
                    case 'pending': // Default Green
                         bgColorClass = 'bg-success';
                        break;
                }

                li.classList.add(bgColorClass, textColorClass);

                // Habit Info Span
                const habitInfo = document.createElement('span');
                habitInfo.innerHTML = `
                    <strong class="habit-name">${habit.name}</strong> - <span class="habit-time fst-italic small">${habit.time}</span>
                `;

                // Complete Button
                const completeButton = document.createElement('button');
                const btnIconClass = habit.completed ? 'fa-undo' : 'fa-check';
                const btnText = habit.completed ? ' Undo' : ' Done';
                completeButton.className = `btn btn-sm ${habit.completed ? 'btn-outline-light' : 'btn-light'} complete-btn`;
                completeButton.innerHTML = `<i class="fas ${btnIconClass}"></i>${btnText}`;
                completeButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent potential event bubbling issues
                    toggleComplete(habit.id);
                });

                li.appendChild(habitInfo);
                li.appendChild(completeButton);
                habitList.appendChild(li);
            });
        }
        // Update the clear button state whenever the list is rendered
        updateClearButtonState();
    }

    // Renders the progress calendar for the last N days
    function renderCalendar() {
        calendarView.innerHTML = ''; // Clear previous calendar
        const today = new Date();

        for (let i = 0; i < CALENDAR_DAYS_TO_SHOW; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i); // Go back i days
            // Use the same consistent date string format
            const dateString = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toDateString();

            // Find habits added on this specific day
            const habitsForDay = habits.filter(h => h.addedDate === dateString);
            let completionPercentage = 0;
            let completedCount = 0;
            const totalCount = habitsForDay.length;

            if (totalCount > 0) {
                completedCount = habitsForDay.filter(h => h.completed).length;
                completionPercentage = Math.round((completedCount / totalCount) * 100);
            }

            // Create calendar day element
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');

            // Add date display (e.g., "Oct 26")
            const dateDisplay = document.createElement('div');
            dateDisplay.classList.add('date');
            // Format date nicely
            dateDisplay.textContent = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dayElement.appendChild(dateDisplay);

             // Add percentage display
            const percentageDisplay = document.createElement('div');
            percentageDisplay.classList.add('percentage');

            if (totalCount > 0) {
                 percentageDisplay.textContent = `${completionPercentage}%`;
                 // Color coding based on percentage
                 if (completionPercentage >= 75) dayElement.classList.add('high-completion');
                 else if (completionPercentage >= 40) dayElement.classList.add('medium-completion');
                 else dayElement.classList.add('low-completion');
            } else {
                 percentageDisplay.textContent = '-'; // Indicate no habits scheduled
                 dayElement.classList.add('no-data');
            }
            dayElement.appendChild(percentageDisplay);

            // Add tooltip (using Bootstrap's tooltip functionality)
            dayElement.setAttribute('data-bs-toggle', 'tooltip');
            dayElement.setAttribute('data-bs-placement', 'top');
            const tooltipTitle = totalCount > 0
                ? `${completedCount} / ${totalCount} completed`
                : 'No habits scheduled';
            dayElement.setAttribute('title', tooltipTitle); // Use 'title' for native or data-bs-title for BS5.3+

            calendarView.prepend(dayElement); // Prepend puts oldest first, newest last (left to right)
            // Use appendChild if you want newest first (right to left layout typical for calendars)
            // calendarView.appendChild(dayElement); // Use this if you prefer right-to-left (newest on right)
        }

         // Initialize Bootstrap tooltips after elements are added to the DOM
         const tooltipTriggerList = [].slice.call(calendarView.querySelectorAll('[data-bs-toggle="tooltip"]'));
         tooltipTriggerList.map(function (tooltipTriggerEl) {
             // Ensure existing tooltips are disposed before creating new ones if re-rendering often
             const existingTooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
             if (existingTooltip) {
                 existingTooltip.dispose();
             }
             return new bootstrap.Tooltip(tooltipTriggerEl);
         });
    }


    // --- Event Listeners ---
    addHabitBtn.addEventListener('click', addHabit);
    clearTasksBtn.addEventListener('click', clearTodaysTasks); // Listener for the clear button

    // Allow Enter key submission in input fields
    habitNameInput.addEventListener('keypress', (e) => {
        errorMessage.style.display = 'none'; // Hide error on typing
         if (e.key === 'Enter') {
             // Automatically focus time input if name is entered and time is empty
             if(habitTimeInput.value === '' && habitNameInput.value.trim() !== ''){
                habitTimeInput.focus();
             } else {
                addHabit(); // Attempt to add if both might have values or time has focus
             }
             e.preventDefault(); // Prevent potential form submission if wrapped in a form
         }
    });
     habitTimeInput.addEventListener('keypress', (e) => {
        errorMessage.style.display = 'none'; // Hide error on typing
         if (e.key === 'Enter') {
             addHabit();
             e.preventDefault(); // Prevent potential form submission
         }
    });


    // --- Initialization & Timer ---
    loadHabits(); // Load habits and render UI on page load

    // Set interval to update statuses periodically (e.g., check for time changes)
    setInterval(() => {
        console.log("Checking habit statuses...");
        renderTodaysHabits(); // Only need to re-render today's list for time-based status changes
        // Calendar only needs re-render if data actually changes (add/complete/clear)
        // Clear button state is updated within renderTodaysHabits
    }, 60000); // Check every 60 seconds (1 minute)
});