# Visualization Dashboard

A Django project for data visualization.

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

This Django project provides a dashboard for data visualization, helping users analyze and understand the data more effectively.

## Requirements

Make sure you have the following installed before proceeding:

- Python (version 3.7.9)
- Django (version 3.2.16)
- Other dependencies listed in [requirements.txt](requirements.txt)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/me-ayush/visualization_dashboard.git
   ```

2. Navigate to the project directory:

   ```bash
   cd visualization_dashboard
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Apply database migrations:

   ```bash
   python manage.py migrate
   ```

## Usage

1. Run the development server:

   ```bash
   python manage.py runserver
   ```

2. Visit [http://localhost:8000/data/](http://localhost:8000/data/) in your web browser.

3. Use the POST button on the page to insert data into the SQL database.

4. After inserting data, visit [http://localhost:8000/](http://localhost:8000/) to enjoy the data visualization.
