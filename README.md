# ChatGpt

How to:
1. Backend
- Install all necessery packages for banckend 
  pip install -r /path/to/requirements.txt
- Update varieables in app.py
  openai.api_type = "azure" - if you are hosting in Azure
  openai.api_version = "2023-03-15-preview" - base on your API version
  openai.api_base = "Your Azure OpenAI resource's endpoint value" 
  openai.api_key = "Your Azure OpenAI resource's key value." 
  deployment_name = "Name of your deployment of GPT model in Azure"

2. Frontend 
- Create new project
- Install node.js (version 16)
  npm install -g node@16.20.0 (cd to your frontend project directory)
- Download files (App.js, App.css, package.json and all in components dir)
- Install all necessery pacgages for frontend (change name:"your app name" in package.json to your frontend application name)
  npm install
- change code in App.js in line 44
  "Your Backend URL"  to your Backend serever url for example localhost:5000/api/chat
 
