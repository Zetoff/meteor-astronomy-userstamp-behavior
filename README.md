# Userstamp behavior for Meteor Astronomy

You can add the `userstamp` behavior to your project by executing the following command.

```sh
meteor add zetoff:astronomy-userstamp-behavior
```

The `userstamp` behavior adds two fields that store the user id that created and last updated the document.

The `userstamp` behavior comes with following options. Options names are self explanatory.

```js
behaviors: {
  userstamp: {
    hasCreatedField: true,
    createdFieldName: 'createdBy',
    createdFieldOptional: false, // must be true to allow inserts by anonymous users
    hasUpdatedField: true,
    updatedFieldName: 'updatedBy',
    updatedFieldOptional: false, // must be true to allow updates by anonymous users
    usersCollection: Meteor.users,
  }
}
```

### Automatically loaded users

In order to provide an easier way to access the users a transient field is created for each one of the fields added by the `userstamp` behavior, and the users will be automatically loaded from the `usersCollection` when the document is retrieved. This fields will have the names specified in the options, while the actual user ids will be stored in the same named field with 'Id' appended at the end.

### Example

Let's take a look at the behavior usage.

```js
var post = new Post();
post.save();

post.createdById; // User id as stored in the database
post.createdBy;   // Transient field with fully loaded user document

/* ... */

post.save();
post.updatedById; // User id as stored in the database
post.updatedBy;   // Transient field with fully loaded user document
```

### Known issues

- Field values after a save are not updated in the client document ([see issue](https://github.com/jagi/meteor-astronomy/issues/343))
