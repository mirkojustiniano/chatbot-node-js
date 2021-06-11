# Node JS chatbot service

Node JS chatbot service that uses Wit.ai for NLP and connects to an iOS client.

# Requirements

## NVM

[Node Version Manager](https://github.com/nvm-sh/nvm), `nvm`, is a bash script to manage multiple active Node.js versions and in my experience the best way to install and manage node js.
A couple sample terminal commands to install NVM on your mac:

    touch ~/.bash_profile
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
   
   You can verify that NVM has been successfully installed by typing this command:

    nvm --version

You should get an output similar to this: 

    7.15.1

## Node

Download, compile, and install the latest release of node with NVM:

    nvm install node

You can verify that Node has been successfully installed by typing this command:

    node -v


You should get an output similar to this one:

    v16.3.0

## NPM

NVM should have installed Node and a couple of tools, including `npm`, which makes it easy to install and update Node.js libraries and packages you might use in your own projects.

You can double check to make sure npm was installed by checking the version:

    npm -v

The output for that should be something like:

    7.15.1


# Starting the Server

From the project root folder run the command:

    node app.js

and visit `http://localhost:3000` in your browser.