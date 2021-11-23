# Getting set up

This app can technically be built into an iOS/Windows application and ran that way. Doing so without a developers license is a pain, so I took a different appraoch.

## Running it

Using `concurrently` we can run `dev` and keep the process going in the background.

Use `npm run dev` to start the process.

Killing the process with CTRL+C will stop it. Closing the terminal **will not**.

You can run `open ~/.bash_profile` and create a shortcut for stopping/starting the server.
