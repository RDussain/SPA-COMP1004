# Too Much Time (TMT)

**Too Much Time (TMT)** is a simple web application designed to help users track their activities, compare time spent against a set limit, and provide intuitive feedback using color indicators.

---

## Features

- **Activity Tracking**: Add activities with their respective time spent and activity limits.
- **Visual Feedback**: Displays a color-coded indicator for each activity based on time spent:
  - Green: Time is within 70% of the limit.
  - Yellow: Time is within 100% of the limit.
  - Red: Time exceeds the limit.
- **Responsive Interface**: Designed with Bootstrap for a clean and responsive layout.

---

## Files

1. **index.html**  
   - Serves as the main structure for the application.
   - Includes sections for displaying activities and adding new ones.
   - Links to external CSS (Bootstrap and `styles.css`) and JavaScript (`app.js`).

2. **styles.css**  
   - Provides custom styling for the status indicators:
     - `.green`: Indicates time spent is within limits.
     - `.yellow`: Warns time is approaching the limit.
     - `.red`: Alerts time has exceeded the limit.

3. **app.js**  
   - Implements the application's logic, including:
     - Adding new activities.
     - Calculating the color status for each activity.
     - Displaying activities dynamically.

---

## How to Use

1. Clone or download the repository.
2. Open `index.html` in your browser to launch the application.
3. Use the **Add New Activity** form to input:
   - Activity Name
   - Time Spent (in minutes)
   - Activity Limit (in minutes)
4. View the added activities and their color-coded status in the **Today's Activities** section.

---

## Technologies Used

- **HTML5**: Provides the structure for the application.
- **CSS3**: Used for styling the user interface, including the activity status indicators.
- **JavaScript (ES6)**: Powers the dynamic functionality, such as adding activities and calculating time status.
- **Bootstrap 5**: Enhances the layout and styling for a responsive design.

---

## Project Structure


---

## Example

1. Add an activity:  
   - Name: "Reading"  
   - Time Spent: 50 minutes  
   - Activity Limit: 60 minutes  

2. Feedback:  
   - A green indicator will appear for the activity, showing that the time spent is within the limit.

---

## Future Enhancements

- **Local Storage**: Save activities persistently across browser sessions.
- **Analytics**: Add charts to visualize time spent across multiple activities.
- **Customizable Limits**: Allow users to set default daily limits.

---


