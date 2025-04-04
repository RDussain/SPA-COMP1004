# TMT – Too Much Time

**TMT** (*Too Much Time*) is a simple Single-Page Application (SPA) that helps you keep track of daily habits, see what’s due soon, and measure how consistent you’ve been over the past week. This README is written at a level suitable for a first-year Computer Science student: it explains the background, main features, and how to get started without going into overly complex details.

---

## Why TMT?

Like many students, I often struggled to balance **coursework**, **social media**, and **everyday life**—leading me to fall behind on important tasks. Existing productivity tools (like Notion, Google Calendar, or Monday.com) felt either too general or too overwhelming for solo time-tracking. **TMT** closes this gap by focusing on **personal habits**, **time reminders**, and **visual feedback** on a daily basis.

---

## Key Features

1. **Add Daily Habits**  
   Type in a habit name and target time (e.g., “Morning Study at 09:00”). The habit immediately appears in the “Today’s Habits” list.

2. **Color-Coded Feedback**  
   - **Green**: The task is still comfortably in the future.  
   - **Yellow**: Less than 30 minutes left, so it’s approaching quickly.  
   - **Red**: The task is overdue and missed if not completed.  
   - **Completed**: Quickly toggle a task as “Done,” which strikes it out in the list.

3. **Clear Today’s Tasks**  
   A single button removes all tasks for the current day after you confirm—perfect for days when plans change dramatically.

4. **Weekly Progress Overview**  
   See the past 7 days of habits in a mini calendar grid. Each day’s percentage tells you how many tasks you finished versus how many you scheduled.

---

## How It Works

- **LocalStorage**: All data is saved in your own web browser. No server or account is required.  
- **No Page Reloads**: TMT updates the screen in real time, using JavaScript to check each task’s status every minute.  
- **Layout & Styling**: Built with simple **HTML**, **CSS**, **Bootstrap**, and **FontAwesome** icons for quick and accessible design.

---

## Usage

1. **Download or Clone** this repository.  
2. **Open `index.html`** in any modern web browser (Chrome, Firefox, etc.).  
3. **Start Adding Habits** using the form on the page.  
4. Watch your tasks appear in “Today’s Habits.” Completed tasks can be toggled with the “Done” button.  
5. Refresh or revisit the page any time—your tasks remain stored in your browser’s LocalStorage.

*(Optional) If you’d like to try advanced features or extend the logic, open `script.js` in a text editor and explore the commented functions that render lists, handle color changes, and display weekly stats.*

---

## References

- Bootstrap, 2025. *Introduction – Bootstrap*. [online] Available at: <https://getbootstrap.com/docs/5.3/getting-started/introduction/> [Accessed 14 Feb. 2025].  
- Mozilla Developer Network (MDN), 2025. *Working with JSON*. [online] Available at: <https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON> [Accessed 22 Feb. 2025].  
- Harvard University, 2022. *CS50 2022 – Lecture 8: HTML, CSS, JavaScript*. [video online] Available at: <https://cs50.harvard.edu/college/2022/fall/weeks/8/> [Accessed 16 Mar. 2025].

---

## Final Note

Whether you’re juggling classes, projects, or just life in general, **TMT** is designed to give you **fast and clear** feedback on how you’re using your time. Feel free to customize it, share it, or expand it—there’s no sign-up or complex setup required. Happy habit-tracking!
