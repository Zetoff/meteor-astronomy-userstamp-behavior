import { Behavior } from 'meteor/jagi:astronomy';

Behavior.create({
  name: 'userstamp',
  options: {
    hasCreatedField: true,
    createdFieldName: 'createdBy',
    createdFieldOptional: false,
    hasUpdatedField: true,
    updatedFieldName: 'updatedBy',
    updatedFieldOptional: false,
    usersCollection: Meteor.users,
  },
  createClassDefinition: function() {
    let definition = {
      fields: {},
      events: {
        beforeInsert: (e) => {
          var doc = e.currentTarget;
          var Class = doc.constructor;
          this.setCreationUserId(doc);
          this.setCreationUser(doc);
        },
        beforeUpdate: (e) => {
          var doc = e.currentTarget;
          var Class = doc.constructor;
          this.setModificationUserId(doc);
          this.setModificationUser(doc);
        },
        afterInit: (e) => {
          this.onEventLoad.call(this, e);
        },
        afterSave: (e) => {
          this.onEventLoad.call(this, e);
        }
      }
    };

    if (this.options.hasCreatedField) {
      // Add a field for storing the creation user id.
      const createdFieldName = this.options.createdFieldName;
      definition.fields[createdFieldName + 'Id'] = {
        type: String,
        immutable: true,
        optional: this.options.createdFieldOptional,
      };
      // Add a transient field to easily retrieve the user
      definition.fields[createdFieldName] = {
        type: Object,
        transient: true,
      };
    }

    if (this.options.hasUpdatedField) {
      const updatedFieldName = this.options.updatedFieldName;
      // Add a field for storing the user id that last updated the document.
      definition.fields[updatedFieldName + 'Id'] = {
        type: String,
        optional: this.options.updatedFieldOptional,
      };
      // Add a transient field to easily retrieve the user
      definition.fields[updatedFieldName] = {
        type: Object,
        transient: true,
      };
    }

    return definition;
  },
  apply: function(Class) {
    Class.extend(this.createClassDefinition(), ['fields', 'events']);
  },
  setCreationUser: function(doc, user) {
    user = user || Meteor.user();

    if (this.options.hasCreatedField) {
      doc[this.options.createdFieldName] = user ? user : null;
    }

    if (this.options.hasUpdatedField) {
      this.setModificationUser(doc, user);
    }
  },
  setCreationUserId: function(doc) {
    let user = Meteor.user();

    if (this.options.hasCreatedField) {
      doc[this.options.createdFieldName + 'Id'] = user ? user._id : null;
    }

    if (this.options.hasUpdatedField) {
      this.setModificationUserId(doc, user);
    }
  },
  setModificationUser: function(doc, user) {
    user = user || Meteor.user();

    if (this.options.hasUpdatedField) {
      doc[this.options.updatedFieldName] = user ? user : null;
    }
  },
  setModificationUserId: function(doc) {
    let user = Meteor.user();

    if (this.options.hasUpdatedField) {
      doc[this.options.updatedFieldName + 'Id'] = user ? user._id : null;
    }
  },
  getUser(userId) {
    return this.options.usersCollection.findOne(userId);
  },
  onEventLoad(e) {
    var doc = e.currentTarget;
    var Class = doc.constructor;

    const createdById = doc[this.options.createdFieldName + 'Id'];
    if (createdById) {
      doc[this.options.createdFieldName] = this.getUser(createdById);
    }

    const updatedById = doc[this.options.updatedFieldName + 'Id'];
    if (updatedById) {
      doc[this.options.updatedFieldName] = this.getUser(updatedById);
    }
  }
});
