const formError = {}

module.exports = {
    // ERROR HANDLE FOR TRAINER SIGNUP FORM
    email: {
        empty: "Must provide an email adress",
        notValid: "Must provide a valid email address",
        emailTaken: "This email is already in use",
    },
    password: {
        empty: "Must provide a password",
        length: "Password must be minimum of 8 characters",
    },
    passwordConf: {
        empty: "Must confirm your password",
        noMatch: "Password confirmation must match your password",
    },
    firstName: {
        empty: "Must provide your first name",
        notValid: "This doesn't look like a name",
    },
    lastName: {
        empty: "Must provide your last name",
        notValid: "This doesn't look like a name",
    },
    age: {
        empty: "Must provide your age",
        notValid: "Must provide a valid age",
    },
    trainingSince: {
        empty: "Must provide a date. note: it doesn't have to be exact!",
        notValid: "Must provide a valid date",
    },
    photo: {
        empty: "We would really like to put a face to this profile!",
        notValid: "Check to see if you uploaded the correct file, this doesn't seem to be a valid photo file type",
    },
}