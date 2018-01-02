# __*VideoFitBackend*__
## __Backend for VideoFit__ inc

### __Deployed environments__

 __Staging:__ **[https://www.videofit-backend-staging.herokuapp.com/api/](https://www.videofit-backend-staging.herokuapp.com/api/)**

> `npm run start-staging`

__Production:__ **[https://www.videofit-backend-production.herokuapp.com/ap](https://www.videofit-backend-production.herokuapp.com/ap)**

> `npm run start-production`

### __To run the api locally__
- Clone this Repo
- Install dependencies with `npm` or `yarn`
- Install mongodb
- Start mongodb using `mongod`
- Start dev server with `npm run start-local` or `yarn start-local`
 
*When mongodb is running and you've started you development server you can access the api at* `localhost:8000/api`


# __ROUTES__


`/client/signup`
> example req.body

```
{
    "email": "email",
    "password: "password",
    "passwordConf": "passwordConf"
}
```

`/client/signin`
> example req.body

 ```
{
     "email": "email",
     "password: "password"
 }
 ```

`/client/signout`
example req.body 
```
{
    "clientID": "clientID"
}
```
`/clients/all`
### __returns all clients__

`/client`
> example req.body 
```
{
    "clientID"
}
```
`/client/update`
> example req.body 
```
{
    "clientID": "clientID",
    "propToUpdate": "newValue"
}
```

`/client/oauth/facebook`
> example req.body
```
{
    "access_token": "facebook_access_token"
}
```

## __CLIENT PHOTOS__
`/client/photos/all`
> example req.body
```
{}
```
`/client/photos`
> example req.body
```
{}
```
`/client/photo/setprofilepic`
> example req.body
```
{}
```

## __TRAINER__
`/trainer/signup`
> example req.body
```
{
    "email": "email",
    "password: "password",
    "passwordConf": "passwordConf"
}
```
`/trainer/signin`
> example req.body
```
{
    "email": "email",
    "password: "password"
}
```
`/trainer/signout`
> example req.body
```
{}
```
`/trainers/all`
> example req.body
```
{}
```
`/trainer/clients/all`
> example req.body
```
{}
```
`/trainer`
> example req.body
```
{}
```
`/trainer/update`
> example req.body
```
{
    "trainerID": "trainerID",
    "propToUpdate": "newValue"
}
```
`'/trainer/delete`
> example req.body
```
{
    "trainerID": "trainerId"
}
```
`/trainer/oauth/facebook`
> example req.body
```
{
    "access_token": "facebook_access_token"
}
```

## TRAINER MESSAGES
`/trainer/message`
> example req.body
```
{}
```
`/trainer/messages/all`
> example req.body
```
{}
```
`/trainer/message/update`
> example req.body
```
{}
```
`/trainer/message/delete`
> example req.body
```
{}
```

## __TRAINER PHOTOS__
`/trainer/photos/all`
> example req.body
```
{}
```
`/trainer/photos`
> example req.body
```
{}
```
`/trainer/photo/setprofilepic`
> example req.body
```
{}
```

## __TASK__
`/task/new`
> example req.body
```
{}
```
`/tasks/all`
> example req.body
```
{}
```
`/task/update`
> example req.body
```
{}
```
`/task/delete`
> example req.body
```
{}
```

## __ROUTINE__
`/routine/new`
> example req.body
```
{}
```

## AWS IMAGE UPLOAD - Handles both client and trainer photo uploads
`/photo/upload`
> example req.body
```
{}
```
`/photo/upload/profile`
> example req.body
```
{}
```

__AWS VIDEO UPLOAD__ - *Handles both client and trainer video uploads*

`/video/upload`
> example req.body
```
{}
```

## __PUSHER MESSAGING__
`/pusher/chatkit/create_user`
> example req.body
```
{
    "clientID": "clientID"
}
```
or
```
{
    "trainerID": "trainerID"
}
```
`/pusher/chatkit/user`
> example req.body
#### Returns single user
```
{
    "ID1": "someID"
}
```
or
#### Returns two users
```
{
    "ID1": "someID",
    "ID2": "someOtherID"
}
```
`/pusher/chatkit/authenticate`
> example req.body
```
{
    "ID": "someID"
}
```
`/pusher/chatkit/client/invite/trainer`
> example req.body
```
{
    "clientID": "clientID",
    "trainerID": "trainerID"
}
```
`/pusher/chatkit/trainer/invite/client`
> example req.body
```
{
    "clientID": "clientID",
    "trainerID": "trainerID"
}
```
## __PUSHER NOTIFICATIONS__
`/pusher/notification/videofit/users/all`
> example req.body
```
{
    "event": "someString",
    "message": "someMessage as a string"
}
```
`/pusher/notification/videofit/trainers/all`
> example req.body
```
{
    "event": "someString",
    "message": "someMessage as a string"
}
```
`/pusher/notification/videofit/clients/all`
> example req.body
```
{
    "event": "someString",
    "message": "someMessage as a string"
}
```
`/pusher/notification/videofit/trainer/clients/all`
> example req.body
```
{
    "trainerID": "trainerID",
    "event": "someString",
    "message": "someMessage as a string"
}
```
`/pusher/notification/videofit/trainer/single`
> example req.body
```
{
    "trainerID": "trainerID"
}
```
`/pusher/notification/videofit/client/single`

> example req.body
```
{
    "clientID": "clientID"
}
```

## __BRAINTREE__
`/payment/get_token`
> example req.body
```
{

}
```
`/payment/checkout`
> example req.body
```
{}
```
# __TESTS__
- `yarn test` or `npm test`
