# ChatGPT

## Description

This project provides inspiration and a basic template to help you create your own Chat GPT application using Python, Flask, and React.

## Setup

### 1. Backend

To set up the backend, follow these steps:

- Install all necessary packages for the backend by running the following command:

```pip install -r /path/to/requirements.txt```

- Update the variables in `app.py`:
- Set `openai.api_type` to `"azure"` if you are hosting in Azure.
- Set `openai.api_version` based on your API version, for example, `"2023-03-15-preview"`.
- Set `openai.api_base` to your Azure OpenAI resource's endpoint value.
- Set `openai.api_key` to your Azure OpenAI resource's key value.
- Set `deployment_name` to the name of your deployment of the GPT model in Azure.

### 2. Frontend

To set up the frontend, follow these steps:

- Create a new project.

- Install Node.js (version 16) by running the following command in your frontend project directory:

```npm install -g node@16.20.0```

- Download the required files (`App.js`, `App.css`, `package.json`, and all files in the `components` directory).

- Install all necessary packages for the frontend. First, update the `name` field in `package.json` to match your frontend application name. Then, run the following command:

```npm install```

- Update the code in `App.js` on line 44 by replacing "Your Backend URL" with your backend server URL, for example, `localhost:5000/api/chat`.
