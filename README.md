# UX724 How to Integrate Open Source JavaScript Libraries to SAPUI5 Applications

This repository contains the material of the code review for SAP TechEd 2016. Hope to see you @TechEd :-) and have fun with the code afterwards.

## Abstract
In this code review, you’ll learn how to integrate the open source JavaScript library OpenLayers in a custom SAPUI5 control. And you’ll also write QUnit tests for this control.

## Idea
Show the trick to integrate with 3rd party JS libs via HTML control. Reuse the ASE UI5 Controls Map control. Show how to write QUnit tests for the control as well.

## Setup
The code review uses the with OpenUI5 grunt build.

### General setup
* Node.js with npm installed
* Ensure your proxy environment variables set, if you need them, e.g.:
	```
	setx HTTP_PROXY http://proxy:8080
setx HTTPS_PROXY http://proxy:8080
setx FTP_PROXY http://proxy:8080
setx NO_PROXY localhost,127.0.0.1
```
For Mac-users you have to use ```set HTTPS_PROXY```

* msysgit installed and git command is available on the command line
* Chrome browser installed

### Specific setup
* Clone this Repo
* Run:

	```
	npm install grunt-cli bower -g

	npm install
	bower install
	```

* Run `` grunt serve `` => Chrome should open with and index page that links all steps

* You can adjust center positions in all steps for your venue coordinates in Step 1 and Step 4

* Open the links on the index page and the code that should be shown


