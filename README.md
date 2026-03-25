### **Playlister Web Application**

**The Challenge:** Developing a high-fidelity media management platform that handles complex relational data and real-time state synchronization. This project focused on creating a seamless user experience for curating digital libraries, requiring the implementation of a custom Transaction Processing System (TPS) and deep integration with the YouTube Data API.

**Technical Architecture & "The Craft":**
* **Transaction Processing System (TPS):** Engineered a robust Undo/Redo system to manage complex user actions, including song reordering, metadata editing, and playlist modifications, ensuring data consistency across the application state.
* **Integrated Media Playback:** Developed a custom player interface leveraging the **YouTube API**, featuring autoplay, sequential playback, and loop functionality for a native-feeling streaming experience.
* **MERN Stack Persistence:** Built a full-stack architecture using **MongoDB, Express, React, and Node.js**, utilizing a **RESTful API** to synchronize frontend interactions with a persistent NoSQL database.
* **Stateful UI with Material UI:** Designed a responsive, polished interface based on strict Figma specifications, using **Material UI** to manage complex layouts and provide immediate visual feedback for user interactions.
* **Scalable Data Modeling:** Designed a normalized schema to track detailed playlist metadata, including owner permissions, play counts, and community engagement metrics (likes/dislikes).

> **Technical Decision Highlight:** "A major challenge was implementing a seamless Undo/Redo feature for song reordering. I chose to implement a Command Pattern-based Transaction Processing System. This allowed me to encapsulate every user action as a discrete object, making the application state predictable and allowing for complex 'time-travel' debugging during development. This significantly elevated the app from a simple CRUD tool to a professional-grade productivity application."
