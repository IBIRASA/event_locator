# Event Locator

This document provides comprehensive instructions for setting up, running, and using the Event Locator API. It covers project setup, technical choices, usage instructions, and testing.

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Technical Choices](#technical-choices)
3.  [Prerequisites](#prerequisites)
4.  [Project Setup](#project-setup)
    - [Cloning the Repository](#cloning-the-repository)
    - [Installing Dependencies](#installing-dependencies)
    - [Environment Variables](#environment-variables)
    - [Database Setup](#database-setup)
5.  [Running the Application](#running-the-application)
6.  [Redis](#redis)
7.  [API Endpoints - Detailed Usage](#api-endpoints---detailed-usage)
    - [Authentication](#authentication)
    - [Events](#events)
    - [Ratings](#ratings)
    - [Favorites](#favorites)
    - [Filtering Events](#filtering-events)
8.  [Testing and Validation](#testing-and-validation)

## 1. Project Overview

The Event Locator API is a backend service designed to manage user authentication, event creation and retrieval, event ratings, and user favorite events. It provides a RESTful API for client applications (web or mobile) to interact with event data.

## 2. Technical Choices

- **Node.js & Express.js:** Chosen for its scalability, performance, and the availability of a wide range of libraries.
- **PostgreSQL:** Selected for its robust data integrity, advanced querying capabilities, and support for the PostGIS extension for spatial queries.
- **JSON Web Tokens (JWT):** Used for secure user authentication and authorization.
- **Redis:** Employed for real-time event notifications.
- **i18next:** Used for language localization and internationalization.
- **dotenv:** Used to manage environment variables.

## 3. Prerequisites

- **Node.js (>= 14.x):** Download from [nodejs.org](https://nodejs.org/).
- **npm or yarn:** Usually installed with Node.js.
- **PostgreSQL (with PostGIS):** Install and configure PostgreSQL, enabling the PostGIS extension for location-based queries.
- **Redis:** Install and run a Redis server for real-time notifications.
- **Postman or similar API testing tool:** Recommended for testing API endpoints.

## 4. Project Setup

### Cloning the Repository

```bash
git clone https://github.com/IBIRASA/event_locator
cd event_locator
```

### Installing Dependencies

```bash
npm install
```

### Environment Variables

```bash
echo"DB_USER">>.env

```

## 5. Database Setup

### Start PostgreSQL

```bash
psql -U postgres

```

### Create the database

```bash
CREATE DATABASE techevent;

```

### Connect to the database

```bash
\c techevent;

```

### Create tables

```bash
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    latitude DECIMAL,
    longitude DECIMAL,
    preferred_categories VARCHAR(255),
    language VARCHAR(10)
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    date_time TIMESTAMP NOT NULL,
    categories VARCHAR(255),
    user_id INTEGER REFERENCES users(id)
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    user_id INTEGER REFERENCES users(id),
    rating INTEGER NOT NULL
);

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    user_id INTEGER REFERENCES users(id)
);

CREATE EXTENSION postgis;

```

## 5. Endpoints

### Authentication

```bash
POST /users/register

```

### Events

```bash
POST /events


```

### Ratings

```bash
POST /ratings


```

### Favorites

```bash
POST /favorites


```

## 6 Redis

### Install Redis

sudo apt update
sudo apt install redis-server

### Start Redis

redis-cli

### In redis-cli terminal
SUBSCRIBE event-notifications

## 7. Testing and Validation

- Use Postman to test endpoints.
- Include the Authorization header for protected routes.
- Test with valid and invalid data to ensure proper error handling.

[View Documentation Online](https://documenter.getpostman.com/view/42118517/2sB2cUA3Cu)
