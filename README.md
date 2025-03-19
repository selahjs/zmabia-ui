# OpenLMIS Reference UI
The OpenLMIS Reference UI is the user interface for the OpenLMIS Reference Distribution. This user interface is designed to be a single page web application that is optimized for offline and low-bandwidth environments.



// Open docker in an interactive shell
> docker-compose run --service-ports zambia-imm-ui

// run these commands
> yarn
> npm install
> grunt




// Build and run the UI against a OpenLMIS server
> grunt build --serve --openlmisServerURL=https://zm-epi-uat.elmis-dev.org/ --noDocs --noStyleguide --noTest

> grunt  watch --openlmisServerUrl=https://zm-epi-uat.elmis-dev.org/ --serve --force --noDocs --noStyleguide --noTest


// Run a watch process that will build and test your code
// NOTE: You must change a file at least once before your code is rebuilt
> grunt watch --serve --openlmisServerURL=https://zm-epi-uat.elmis-dev.org/



Multiple UI modules are compiled together with the OpenLMIS dev-ui to create the OpenLMIS Reference-UI. UI modules included in the OpenLMIS Reference-UI are:
* [OpenLMIS Auth UI](https://github.com/OpenLMIS/openlmis-auth-ui)
* [OpenLMIS Fulfillment UI](https://github.com/OpenLMIS/openlmis-fulfillment-ui)
* [OpenLMIS Reference Data UI](https://github.com/OpenLMIS/openlmis-referencedata-ui)
* [OpenLMIS Report UI](https://github.com/OpenLMIS/openlmis-report-ui)
* [OpenLMIS Requisition UI](https://github.com/OpenLMIS/openlmis-requisition-ui)
* [OpenLMIS UI Components](https://github.com/OpenLMIS/openlmis-ui-components)
* [OpenLMIS UI Layout](https://github.com/OpenLMIS/openlmis-ui-layout)
