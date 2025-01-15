// Main data storage
let activities = [];

function getStatusColor(timeSpent, activityLimit) {
    let timePercentage = timeSpent / activityLimit;
    
    if (timePercentage < 0.7) return 'green';
    if (timePercentage < 1.0) return 'yellow';
    return 'red';
}

// Main display function for activities and status
function displayActivities() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const activityDiv = document.createElement('div');
        activityDiv.className = 'mb-2';
        const color = getStatusColor(activity.timeSpent, activity.activityLimit);
        activityDiv.innerHTML = `
            ${activity.name}: ${activity.timeSpent} minutes / ${activity.activityLimit} minutes limit
            <span class="status-indicator ${color}"></span>
        `;
        activityList.appendChild(activityDiv);
    });
}

// New activity handler
document.getElementById('activityForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('activityName').value;
    const timeSpent = parseInt(document.getElementById('timeSpent').value);
    const activityLimit = parseInt(document.getElementById('activityLimit').value);
    
    activities.push({
        name: name,
        timeSpent: timeSpent,
        activityLimit: activityLimit,
        timestamp: new Date().toISOString()
    });
    
    console.log('Saving activities:', JSON.stringify(activities));
    
    this.reset();
    displayActivities();
});

displayActivities();