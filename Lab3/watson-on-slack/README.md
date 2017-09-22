# `watson-on-slack`
A simple program for talking to Watson on Slack

## Prerequisites
Before getting started, you'll need a Bluemix account with an instance of Watson Conversation.

You'll also need to create a Slack bot token, which can be done by following the instructions here.

## Running locally
1. Clone or download this repository.
2. `cd` into the directory.
3. Edit the `.env` file with your Watson Conversation credentials and Slack bot token.
4. Run `npm install`.
5. Run `npm start`.
6. That's it!

## Deploying to Bluemix
1. Clone or download this repository.
2. `cd` into the directory.
3. Edit the `manifest.yml` file with your unique name/host, Watson Conversation credentials, and Slack bot token.
4. Run `cf login -a api.ng.bluemix.net` and follow the prompts. Note that you might need to add the `--sso` flag to the end.
5. Run `cf push <your_app_name>`.
6. That's it!
