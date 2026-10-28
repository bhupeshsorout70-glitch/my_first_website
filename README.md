# Campus Board — Digital Notice Board

A beginner-friendly college project built with HTML, CSS, and vanilla JavaScript. It is designed as a module that can be embedded into an existing Campus Board app.

## Features

- Responsive desktop and mobile layout
- Sample campus notices
- Search by title, description, or category
- Filter by Academic, Examination, Events, Placement, and General
- Sort notices by date
- Highlight important notices
- Demo admin mode to add, edit, and delete notices
- Optional attachment links
- Summary counters
- Saves data in browser `localStorage`

## Run it locally

1. Download and extract the ZIP.
2. Open `index.html` in a browser.
3. Click **Admin mode** to add, edit, or delete notices.
4. Try searching and filtering the sample notices.

No installation or build tools are required.

## Add it to your existing Campus Board app

### If your app is a simple HTML/CSS/JavaScript project
- Copy the notice-board section from `index.html` into your app's page.
- Add the relevant CSS from `style.css` to your main stylesheet.
- Include `script.js` near the end of the page, before `</body>`.
- Avoid duplicate IDs if your app already has elements with the same IDs.
- If you want a separate page, keep `index.html`, `style.css`, and `script.js` together and link to `index.html` from your app's navigation.

### If your app uses React, Vue, or another framework
This project is a standalone HTML prototype. The UI needs to be converted into framework components, and event handlers should be adapted to the framework. Do not paste the full HTML document into a component.

## Important limitations

This is a functional front-end prototype, not a secure production admin system:
- Notices are saved only in the current browser on the current device.
- Other students will not automatically see notices added from your device.
- Admin mode is a demo toggle, not authentication; anyone who opens the page can enable it.
- Data can be cleared when browser storage is cleared.

For a real campus deployment, connect the notice list and admin actions to your existing backend and database, and use server-side authentication/authorization. Do not store passwords or secrets in this front-end code.

## Suggested database fields for a future backend

`id`, `title`, `category`, `description`, `notice_date`, `attachment_url`, `is_important`, `created_by`, `created_at`, `updated_at`.

## Suggested API endpoints for a future backend

- `GET /api/notices` — list notices
- `GET /api/notices/:id` — view one notice
- `POST /api/notices` — create a notice (authorized admin only)
- `PUT /api/notices/:id` — update a notice (authorized admin only)
- `DELETE /api/notices/:id` — delete a notice (authorized admin only)

## Project abstract (for college submission)

The Digital Notice Board is a web-based module intended to centralize campus announcements. It allows users to view, search, filter, and sort notices by category and date. An administrative interface supports creating, editing, and deleting announcements, while important notices can be highlighted. The prototype uses HTML for structure, CSS for responsive styling, JavaScript for client-side interaction, and browser localStorage for demonstration data persistence. A future version can integrate with the institution's existing backend for shared data and authenticated administration.
