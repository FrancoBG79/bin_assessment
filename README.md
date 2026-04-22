# Project Title

A full-stack application leveraging an Angular frontend and a FastAPI backend, designed for seamless development and deployment.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
   - [Step 1: Database Setup](#step-1-database-setup)
   - [Step 2: Backend (FastAPI)](#step-2-backend-fastapi)
   - [Step 3: Frontend (Angular)](#step-3-frontend-angular)
5. [Troubleshooting](#troubleshooting)

---

## Project Overview
This project consists of two primary modules:
- **api/**: FastAPI backend service.
- **web/**: Angular frontend application.

The project utilizes Docker Compose to manage the database layer, ensuring a consistent environment across different development machines.

## Prerequisites
Before you begin, ensure you have the following installed on your system:
- **Node.js & npm**: Recommended LTS version.
- **Python 3.10+**: Ensure your Python environment is set up.
- **Docker & Docker Compose**: Required for running the database containers.
- **Angular CLI**: Install globally via `npm install -g @angular/cli`.

---

## Project Structure
```text
├── api/                  # FastAPI source code & requirements
├── web/                  # Angular source code
├── docker-compose.yml    # Database infrastructure orchestration
├── init_db.py            # Database initialization script
└── README.md             # This documentation

## Run Docker
docker-compose up -d

## Run API
cd api;
python -m venv venv;
venv\Scripts\activate;
pip install -r requirements.txt
fastapi dev main.py

## Run web
cd web;
npm install;
ng serve;

## DB issues
python init_db.py