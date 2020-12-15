define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "Step 1", "key": "step1" },
        { "label": "Step 2", "key": "step2" },
        { "label": "Step 3", "key": "step3" },
        { "label": "Step 4", "key": "step4", "active": false }
    ];
    var currentStep = steps[0].key;
    
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

   
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
               if (key === 'message') {
                    message = val;
                } 
              
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
    function onClickedNext () {
        if (
            (currentStep.key === 'step3' && steps[3].active === false) ||
            currentStep.key === 'step4'
        ) {
            save();
        } else {
            connection.trigger('nextStep');
        }
    }

    function onClickedBack () {
        connection.trigger('prevStep');
    }

    function onGotoStep (step) {
        showStep(step);
        connection.trigger('ready');
    }

    function showStep(step, stepIndex) {
        if (stepIndex && !step) {
            step = steps[stepIndex-1];
        }

        currentStep = step;

        $('.step').hide();

        switch(currentStep.key) {
            case 'step1':
                $('#step1').show();
                connection.trigger('updateButton', {
                    button: 'next',
                    enabled: Boolean(getMessage())
                });
                connection.trigger('updateButton', {
                    button: 'back',
                    visible: false
                });
                break;
            case 'step2':
                $('#step2').show();
                connection.trigger('updateButton', {
                    button: 'back',
                    visible: true
                });
                connection.trigger('updateButton', {
                    button: 'next',
                    text: 'next',
                    visible: true
                });
                break;
            case 'step3':
                $('#step3').show();
                connection.trigger('updateButton', {
                     button: 'back',
                     visible: true
                });
                if (lastStepEnabled) {
                    connection.trigger('updateButton', {
                        button: 'next',
                        text: 'next',
                        visible: true
                    });
                } else {
                    connection.trigger('updateButton', {
                        button: 'next',
                        text: 'done',
                        visible: true
                    });
                }
                break;
            case 'step4':
                $('#step4').show();
                break;
        }
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
