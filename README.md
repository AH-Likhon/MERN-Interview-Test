<a href="https://github.com/AH-Likhon/MERN-Interview-Test" target="_blank"># Whiteboard App (Github Link)</a>

## Project Overview

1. This project allows users to create, edit, and manage drawings. Users can start drawing on the home page using different shapes like lines, rectangles, circles, and text, with color selection and a title. They can clear the drawing using the "CLR" button and save it to the database by clicking the "Save" button.

2. In the "Drawings" page, users can view all saved drawings in a table. They can:

- View a specific drawing by clicking on its title.
- Update the drawing using the update button (will redirect to the edit page).
- Delete a drawing with the delete button.

## Features

- Drawing shapes and text with color options.
- Clear and save drawings.
- View, update, and delete drawings.

## Technology Used

- Frontend: React
- Backend: Node, Express (Followed MVC pattern in the backend)
- Database: MongoDB

## How to Run Both Frontend and Backend:

1. Install the packages for the frontend, backend, and root using:

   > npm i

2. To run the frontend and backend simultaneously, use the following command from the root folder (concurrently):
   > npm start

### Frontend server and routes:

1. [localhost:3000](http://localhost:3000/)
2. Home: "/"
3. Drawings: "/drawings
4. Specific Drawing Page to view: "/drawings/:id"
5. Specific Drawing Page to update: "/drawings/:id/edit"

Note: You will find all of the routes from the Navbar and Table of the drawings

### Backend: [localhost:5000](http://localhost:5000/)

1. Get/Post: /api/v1/drawings
2. Specific Get/Put/Delete: /api/v1/drawings/:id
