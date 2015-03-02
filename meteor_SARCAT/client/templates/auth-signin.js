var ERRORS_KEY = 'signinErrors';
/*
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});*/
Template.signin.created = function() {
    Session.set(ERRORS_KEY, {});




};
Template.signin.helpers({
    errorMessages: function() {
        return _.values(Session.get(ERRORS_KEY));
    },
    errorClass: function(key) {
        return Session.get(ERRORS_KEY)[key] && 'error';
    },
    initConfig: function() {
            return Session.get('initConfig');
        }
});
Template.signin.events({
    'submit': function(event, template) {
        event.preventDefault();
        var email = template.$('[name=email]')
            .val();
        var password = template.$('[name=password]')
            .val();
        var errors = {};
        if (!email) {
            errors.email = 'Email is required';
        }
        if (!password) {
            errors.password = 'Password is required';
        }
        Session.set(ERRORS_KEY, errors);
        if (_.keys(errors)
            .length) {
            return;
        }
        Meteor.loginWithPassword(email, password, function(error) {
            if (error) {
                return Session.set(ERRORS_KEY, {
                    'none': error.reason
                });
            }
            //Router.go('user-home', Meteor.user());
            //Router.go('form', Records.findOne());
            Router.go('user-home', Meteor.user());
            //Router.go('listsShow', Records.findOne());
        });
    }
});