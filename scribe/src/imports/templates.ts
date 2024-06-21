// src/app/templates.ts
interface Template {
  title: string;
  content: string;
}

// src/app/templates.ts
export const templates: { [key: string]: Template } = {
  meeting: {
    title: 'Meeting Notes',
    content: `
        <div>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">event</span>
            Meeting Date
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;  font-size: 1.1em;">list</span>
            Agenda
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;  font-size: 1.1em;">people</span>
            Attendees
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;  font-size: 1.1em;">forum</span>
            Discussion Points
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;  font-size: 1.1em;">check_circle</span>
            Action Items
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;  font-size: 1.1em;">next_plan</span>
            Next steps
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
        </div>
      `,
  },
  tasksList: {
    title: 'Tasks List',
    content: `
        <div>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">check_circle_outline</span>
            Task
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">done</span>
            Completed Tasks
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
        </div>
      `,
  },
  projectPlan: {
    title: 'Project Plan',
    content: `
        <div>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">event</span>
            Project Name
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;  font-size: 1.1em;">mode_standby</span>
            Objectives
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;  font-size: 1.1em;">flag</span>
            Milestones
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;  font-size: 1.1em;">date_range</span>
            Timeline
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;  font-size: 1.1em;">paid</span>
            Resources
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
          <h3 style="font-weight: 500; margin-top: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;  font-size: 1.1em;">emergency</span>
            Risks and Issues
          </h3>
          <ul>
            <li style="margin-left: 20px; margin-top: 5px;"></li>
          </ul>
        </div>
      `,
  },
  eventPlan: {
    title: 'Event Plan',
    content: `
      <div>
        <h3 style="font-weight: 500; margin-top: 15px;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">date_range</span>
          Event Date
        </h3>
        <ul>
          <li style="margin-left: 20px; margin-top: 5px;"></li>
        </ul>
        <h3 style="font-weight: 500; margin-top: 15px;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">location_on</span>
          Location
        </h3>
        <ul>
          <li style="margin-left: 20px; margin-top: 5px;"></li>
        </ul>
        <h3 style="font-weight: 500; margin-top: 15px;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">schedule</span>
          Schedule
        </h3>
        <ul>
          <li style="margin-left: 20px; margin-top: 5px;"></li>
        </ul>
        <h3 style="font-weight: 500; margin-top: 15px;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">note</span>
          Details
        </h3>
        <ul>
          <li style="margin-left: 20px; margin-top: 5px;"></li>
        </ul>
      </div>
    `,
  },
  lectures: {
    title: 'Lecture Notes',
    content: `
      <div>
        <h3 style="font-weight: 500; margin-top: 15px;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">book</span>
          Topic
        </h3>
        <ul>
          <li style="margin-left: 20px; margin-top: 5px;"></li>
        </ul>
        <h3 style="font-weight: 500; margin-top: 15px;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">school</span>
          Key Points
        </h3>
        <ul>
          <li style="margin-left: 20px; margin-top: 5px;"></li>
        </ul>
        <h3 style="font-weight: 500; margin-top: 15px;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">assignment</span>
          References
        </h3>
        <ul>
          <li style="margin-left: 20px; margin-top: 5px;"></li>
        </ul>
        <h3 style="font-weight: 500; margin-top: 15px;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">note</span>
          Summary
        </h3>
        <ul>
          <li style="margin-left: 20px; margin-top: 5px;"></li>
        </ul>
      </div>
    `,
  },
  dailyPlanner: {
    title: 'Daily Planner',
    content: `
      <div>
        <h3 style="font-weight: 500; margin-top: 15px;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">today</span>
          Date
        </h3>
        <ul>
          <li style="margin-left: 20px; margin-top: 5px;"></li>
        </ul>
        <h3 style="font-weight: 500; margin-top: 15px;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">schedule</span>
          Schedule
        </h3>
        <ul>
          <li style="margin-left: 20px; margin-top: 5px;"></li>
        </ul>
        <h3 style="font-weight: 500; margin-top: 15px;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">check_box_outline_blank</span>
          To-Do List
        </h3>
        <ul>
          <li style="margin-left: 20px; margin-top: 5px;"></li>
        </ul>
        <h3 style="font-weight: 500; margin-top: 15px;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; font-size: 1.1em;">event_note</span>
          Notes
        </h3>
        <ul>
          <li style="margin-left: 20px; margin-top: 5px;"></li>
        </ul>
      </div>
    `,
  },
};
