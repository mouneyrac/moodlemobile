require.config({
    paths: {
        root: '..'
    }
});

require(["root/externallib/text!root/config.json","root/externallib/text!root/lang/en.json"],
function (config, lang) {
    
    config = JSON.parse(config);
    MM.init(config);
    
    
    require.config({
        baseUrl: "plugins",
        packages: config.plugins
    });
    
    var extraLang = "root/externallib/text!root/lang/" + config.default_lang + ".json";
    config.plugins.unshift(extraLang);
    
    require(config.plugins,
        function (extraLang) {
            MM.lang.loadLang("core", config.default_lang, JSON.parse(extraLang));
            $(document).ready(function(){
                MM.loadLayout();
            
                // Request iOS Push Notification and retrieve device token
                var pushNotification = window.plugins.pushNotification;
                pushNotification.registerDevice({alert:true, badge:true, sound:true},
                    function(status) {
                        // Check the device token is not already known
                        if (status['deviceToken'] != MM.getConfig("ios_device_token")) {
                            // Save the device token setting
                            MM.setConfig('ios_device_token', status['deviceToken']);
                        }
                    }
                );

                // Check for notification when the app launch.
                MM.checkForNotification();
            });
        }
    );

    // Every pages should have a push notification event.
    document.addEventListener('push-notification', function(event) {
        var notification = event.notification;
        MM.saveAndDisplayNotification(notification);
    });
});

