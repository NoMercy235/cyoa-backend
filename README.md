Choose Your Own Adventure API
==================================

This project was started as a common idea expressed by the members of the [Time Travelers Anonymous](https://habitica.wikia.com/wiki/The_Keep:Time_Travelers_Anonymous) party founded in [Habitica](https://habitica.com).

It will allow the users to both create and view stories written in the CYOA-style. For the first release, we're only planning on having the basic functions up and working, but stay tuned in the future for more improvements (if the project actually turns out to be usable).

Backend features:

- [x] Register/login users (use JWT for authentication)
- [x] Main resources
    - [x] CRUD for story
    - [x] CRUD the sequences
    - [x] CRUD for attributes of a story
    - [x] CRUD for player
- [x] Copy the story's attributes with their default value to the player when a user starts reading a story for the first time.
- [x] Create options with consequences on a sequence.
- [ ] Create lose condition for stories.

Getting Started
---------------

```sh
# clone it
SSH: git clone git@github.com:NoMercy235/cyoa-backend.git
HTTPS: git clone https://github.com/NoMercy235/cyoa-backend.git

# Navigate to it
cd cyoa-backend

# Install dependencies
npm install

# Start development:
npm start
```

Create a `config.js` file in the `src` directory with the following template:

```javascript
{
    "secret": "secret_string for password encryption",
    "database": "mongo url"
}
```


Docker Support
------

For best experience, you should use the `docker-compose` command.

```sh
cd cyoa-backend

# Build your docker
docker build -t cyoa-backend .
#            ^               ^
#            tag name        Dockerfile location

# run your docker
docker run -p 8080:8080 cyoa-backend
#          ^            ^
#          bind the     container tag
#          port to your
#          host machine port

```

Or you can use `docker-compose` in order to spin up both the app and the mongo db and create a network with the two of them:

```sh
cd cyoa-backend

docker-compose build
docker-compose up -d

# For shutdown and cleanup
docker-compose down

```

License
-------

MIT
