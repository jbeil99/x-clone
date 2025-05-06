<br />

<p align="center">
  Twitter clone built in Django + React + Bootstrap
</p>

## Preview 🎬


## Features ✨

- Authentication with Authentication using 
- Users can add tweets, like, retweet, and reply
- Users can delete tweets, add a tweet to bookmarks, and pin their tweet
- Users can add images and GIFs to tweet
- Users can follow and unfollow other users
- Users can see their and other followers and the following list
- Users can see all users and the trending list
- Realtime update likes, retweets, and user profile
- Realtime trending data from Twitter API
- User can edit their profile
- Responsive design for mobile, tablet, and desktop
- Users can customize the site color scheme and color background
- All images uploads are stored on Firebase Cloud Storage

## Tech 🛠

Frontend: React, Bootstrap

Backend: Django, Djoser, REST Framework

Realtime: WebSockets / Django Channels


## Development 💻

Here are the steps to run the project locally.

1. Clone the repository

   ```bash
   git clone https://github.com/jbeil99/x-clone.git
   ```

1. Create and activate a virtual environment
   ```bash
    python -m venv env
    source env/bin/activate
   ```

1. Install backend dependencies

   ```bash
   pip install -r requirements.txt
   ```
1. Install frontend dependencies

   ```bash
   npm i
   ```

1. Run the frontend

   ```bash
   npm run dev    
   ``` 

1. Run the backend

   ```bash
   chmod +x runserver.sh 
   ./runserver.sh 
   ``` 

> **_Note_**: Ensure Python and Node.js are installed on your system
<br>
Install dependencies inside a virtual environment