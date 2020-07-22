define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
console.log("Inside onrender");
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }
    console.log("Hiii");

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
            console.log("payload"+payload);
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log("Arguments"+inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                
              
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
        console.log("Helloo onGetEndpoints");
    }

    function save() {
      
        console.log("Helloo save");
        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "contactKey": "{{Contact.Key}}",
            "emailAddress": "{{Contact.Attribute.TestCustomActivityDE.EmailAddress}}"
        }];
        
        payload['metaData'].isConfigured = true;

        console.log("Payload"+payload);
        connection.trigger('updateActivity', payload);
    }


});
