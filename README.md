# infra-paas-node-starter-project version 1.1.0

The PaaS NodeJS Starter Project is intended to be a mechanism for jump starting TELUS teams that want to use OpenShift pipelines to deploy their NodeJS applications quickly.

Version 1.1.x introduces the ability for teams to use a node build step in their package.json. This will allow the eventual introduction of tools like [webpack](https://webpack.js.org/) and [babel](https://babeljs.io/).

## Selected Components

The OpenShift project team took the introduction of this CI/CD pipeline as a mechanism to introduce some new technologies to TELUS. The hope is that the selected components can help developer productivity.

- [Node.js 8.11.x](https://nodejs.org/dist/latest-v8.x/docs/api/): Node.js is a Javascript-based language that uses single-threaded system to allow fast handling of requests.
- [Jenkins 2.x](https://jenkins.io/changelog/#v2.60): Jenkins 2.x supports Jenkinsfile which allows us to adopt a "build as code" concept. Jenkins files are auditable, reviewable and editable by all members of the team.

## Initial Setup

### Environment Management Approval

Project teams must work with the EnvironmentManagement team to judge the suitability of your application to the OpenShift environment. Please review the onboarding guides at [go/paas](https://jam2.sapjam.com/groups/FPc32ywZmowyH08hEHoJ93/overview_page/MPgctEap4MHd1thuYl2u2E).

### SCM Setup

Following EM approval to accept your application to OpenShift, the project team will be required to have an empty Git repository created in the SCM managed Git. Due to the nature of this effort, the application doesn't follow the traditional TELUS archetypes.

#### JIRA user

The user `PAASCI API USER` must be added to your Jira board and be assigned the role of Adminstrator. The pipeline uses this UID to post the results of integration tests and unit tests to JIRA.

### Starter Clone

The infra-paas-node-starter-project will be cloned into your new repository. The following scripts need to be executed to create and initialize your OpenShift project

The pipeline re-organizes the management of build meta data. As such, the following attributes must be known at project creation:

- `application-name`:The OpenShift application name.
- `namepspace`: The OpenShift project name.
- `version`: The version number of the service or application.
- `git-repo`: The repository that contains the application source code.
- `git-branch`: The branch name to execute builds on.
- `jira-key`: The jira project to record issues against.
- `jira-epic-key`: The jira epic to record issues against.

The following scripts must be executed:

- `/scripts/create-project-jenkins.sh`: Creates an OpenShift project and Jenkins instance.
- `/scripts/create-branch-build.sh`: Links the Jenkins instance, OpenShift project and Git repository together. It also sets the various variables within the build configuration of the pipeline.

### Upstream repositories

In order to minimize the effort required to propagate changes from `infra-paas-node-starter-project` to derived projects, using git forks is recommended. A series of upstream repositories must be set in any local repositories:

```shell
git remote add upstream http://tfs.tsl.telus.com/tfs/telus/BT-GIT/_git/infra-paas-node-starter-project
```

Executing the command `git remote -v` should provide references to your application repository, as well as the starter project.

```shell
upstream http://tfs.tsl.telus.com/tfs/telus/BT-GIT/_git/infra-paas-node-starter-project
(fetch)
upstream http://tfs.tsl.telus.com/tfs/telus/BT-GIT/_git/infra-paas-node-starter-project
(push)
```

As changes are introduced by the PaaS team, updates can be retrieved from the parent project by executing the following steps.

- Fetch from the upstream repository

```bash
git fetch upstream
```

- Merge the changes to your master branch.

```bash
git merge upstream/master
```

- If you encounter errors you may be required to invoke the command with the following arguments

```bash
git merge upstream/master --allow-unrelated-histories
```

### package.json Customization

The following information in the package.json must be modified to reflect the particulars of your application.

```
  "name": "paas-node-starter",
  "version": "1.0.0",
  "description": "Node.js on Openshift",
  "author": "Michael Lapish <michael.lapish@telus.com>",
```

### Jenkinsfile Customization

Version 1.1.1 of the node-starter-kit minimizes the number of attributes that need to be managed in the Jenkinsfile. The only attribute that is likely to be managed is the Jenkins library that it includes.

## Integration Testing

The pipeline demands that a series of integration tests are written for the service. These must be completed in the `integration-test/` directory. The starter project uses the [mocha](https://mochajs.org/) and [chai](https://www.chaijs.com/) libraries to conduct integration testing. The script to run the tests is: "npm run integrationtest". Configuration can be found in package.json under scripts > integrationtest.

## Unit Testing

npm run unittest

## Application Modification

Application teams are expected to refactor the `src/` and `src/__tests__` packages to implement their required business functionality as well as remove any template code.

### Appliction Configuration

The Paas NodeJS Starter Project uses configurations organized by environments. The files are located at `/config` and requires environment specific configurations be established. The files are:

- default.yaml - any configurations that applies to all environments will go here
- dv.yaml - configurations that only apply to DV environment will go here
- it01.yaml - configurations that only apply to IT01 environment will go here
- it02.yaml - configurations that only apply to IT02 environment will go here
- it03.yaml - configurations that only apply to IT03 environment will go here
- it04.yaml - configurations that only apply to IT04 environment will go here
- pr.yaml - configurations that only apply to PR environment will go here
- test.yaml - configurations that only apply to a test or local environment will go here
- integrationtest-config.json - configurations that have to do with integration testing will go here

Version 1.1.x of the node-starter-kit introduces the use of the `config` libraries `NODE_CONFIG_ENV` to isloate the configuration environment from the `NODE_ENV`.

### Notification

The file `notification.yaml` must be updated to reflect which individuals must be updated to receive notifications from OpenShift

```
all:
  - user1.name@telus.com
  - user2.name@telus.com
stage:
  - user3.name@telus.com
input:
  - user5.name@telus.com
error:
  - user4.name@telus.com
  - user5.name@telus.com
```

In the example provided, user1 and user2 will receive all notifications from OpenShift, but user3,user4,user5 will receive only select communications.

## Actuator Endpoints

The NodeJS Starter project is uses it's own custom actuator module, located at `src/util/actuator.js`
When deployed to OpenShift, the `/info` endpoint is used to establish the health of the application. Other significant endpoints include:

- `/health` Establish the health of the application
- `/info` Get details about the build and tag of the application
- `/env` Get the environment Variables
- `/metrics` Show metric information for the application
- `/config` Get a representation of the config file

## Running Locally

### Initial Setup

### Set Registry

TELUS continues to evaluate how it will manage NPM packages. In the interim, the preference is to make use of Nexus as a proxy to NPM in order to audit what packages are in use.

```
npm config set registry http://repomgr.tsl.telus.com/repository/telus-npm-unauthorized/
npm config set strict-ssl false
npm install
```

The TELUS Nexus Repository manager may not resolve based on your proxy settings. If you encounter errors with the install step, attempt it with the proxy unset.

```
http_proxy="" HTTP_PROXY="" npm install
```

### Starting the application locally

Any images that are created for use in OpenShift will be run in production mode. Use of debuggers is preffered to be executed in local environments. The environment variables `NODE_ENV` and `NODE_CONFIG_ENV` are required to execute the application locally.

These could be set as environment variables

```
set NODE_ENV=development
set NODE_CONFIG_ENV=test
npm run start
```

or inline

```
NODE_ENV=development NODE_CONFIG_ENV=dv npm run start
```

### Development Mode

```
npm run devstart
```

Use `npm run devstart` to run the application in hot reload mode. `devstart` runs `server.js` with nodemon and it will automatically restart the node process when source file changes are saved. `devstart` is defined as `NODE_ENV=development NODE_CONFIG_ENV=dv npm run devstart` in `package.json`.

If your application needs a different set of configurations for local development but you still want your dv paas pod configuration to work, you can add something like `localdev.yaml` to the `config` folder and modify your devstart script to:

```
NODE_ENV=development NODE_CONFIG_ENV=localdev npm run devstart
```
