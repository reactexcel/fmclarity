FM Clarity is a commercial SaaS app for facility management. 

It is written in Meteor (currently 1.3.2.4) with interface components rendered primarily using ReactJS. 

The back end is driven by MongoDB (currently version 2.6) with a custom ORM, RBAC and interface components. 

The source was originally organised using "packages for everything" [(see:"Is packages for everything the solution...")](https://forums.meteor.com/t/is-packages-for-everything-the-solution-to-all-meteor-problems/1785) but since the release of Meteor 1.3 the packages have been converted to ES6 modules with a structure based loosely around Kadira Inc.'s [Mantra architecture](https://kadirahq.github.io/mantra/).

## Installation

FMC runs on Meteor with dependencies on a number of Meteor and node packages. Development is theoretically possible on any platform but requires meteor, node, npm. Three branches are maintained, production (master), staging (develop) and demo. We use the [gitflow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) version control workflow.

To run a local development copy of FMC make a local clone of [https://bitbucket.org/mrleokeith/fm-clarity](https://bitbucket.org/mrleokeith/fm-clarity) then...

```bash
cd fm-clarity
meteor install
npm install
meteor
```

## Application structure

The application structure based loosely around Kadira Inc.'s [Mantra architecture](https://kadirahq.github.io/mantra/) except that while Mantra is a client based architecture FM Clarity is largely isomorphic with very little code running exclusively on either the client or server.

The bulk of the source is written in a series of interdependent ES6 modules divided into the following namespaces.

* **core** _Core modules providing the central engine for operation. This includes ORM, validation, roles based authentication, form generation and handling. Much of this functionality is available in exiting Meteor packages but due to the complexity of the user roles in this application it has been mainly custom built_
* **models** _The main models and schemas, each packaged with a few interface components that can be used to manipulate them._
* **mixins** _Reusabile functionality like thumbnail storage and user membership that can be added onto the core models using a mixin pattern._
* **features** _Higher level features of the app such as report generation and compliance monitoring._
* **ui** _Modules encapsulating the core interface components include and entire suite or Material Design compliant basic input components and come higher level components for navigation and formatting including data table, navigation drawer, floating action button._

For a more detailed breakdown of the contents of each namespace see the JSDOC generated API documentation.

**Module structure**

Each module within these namespaces contains a consistent structure (although there may be some slight variation depending on the size and purpose of the module).

|- index.jx         Imports all submodules from the local namespace and exports them under the module name (todo - link to example)
|- actions.jsx      Includes any state-changing actions relevant to this module
|- routes.jsx 	    Includes the routes for any pages implemented by this module
|- _[stylesheets]_    [any stylesheets required by the module]
|- imports
   |- components    Any React component implemented by this model
   |- containers    Data containers for any React pages pages or components
   |- schemas       Any schemas required by this model
   |- _[Module.jsx]_  If this module requires a central point of execution the 'main' file goes here with the same name as the module

## Database implementation

FMC uses MongoDB/MiniMongo for the database. Collections are wrapped in a custom model class [core/ORM.Model](module-core_ORM.Model.html) that provides validation and limited authentication. Secure code is run in Meteor methods but where possible these are abstracted away using a custom ValidatedMethod ([code/ORM.ValidatedMethod](module-core_ORM.ValidatedMethod.html)) styled after the [mdg:validated-method](https://github.com/meteor/validated-method) package (more information at [Meteor Guide](https://guide.meteor.com/methods.html) ).

All state changing actions should be encapsulated either in a validated method or an instance of the custom [class Action](module-core_Actions.Action.html).

The data model consists of eight main entities. Detailed information on the structure of each can be found in the respective schemas linked in below. 

Please note:

- all entities are referred to in the plural
- models are implemented as basic Meteor/Mongo collections with functionality added onto them by [core/ORM.Model](module-core_ORM.Model.html)
- [dburles:collection-helpers](https://github.com/dburles/meteor-collection-helpers) are used in some instances but should be avoided as they lead to tight coupling of database entities and can cause problems with circular dependencies in the ES6 models. [note:ES6 circular dependencies fail without generating a warning or error](https://github.com/webpack/webpack/issues/1788).

## Database structure

The data model consists of eight main entities listed here in order of significance. For more information please see [models](module-models.html).

**Core**

* **Users** _Extends Meteor.users to provide some additional custom functionality._ ([See UserSchema](models_Users_imports_schemas_UserSchema.jsx.html))
* **Teams** _A team represents an account. Each team has member users and every user needs to be a member of a team. Users can be members of more than one team. A team may be for a "Facility Management" (FM) account or a "Supplier/Contractor" account in which case available options are slightly different._ ([See TeamSchema](models_Teams_imports_schemas_TeamSchema.jsx.html))
* **Facilities** _Teams have a variety of related facilties. Facilities are saved in FM accounts. Each facility has only one team but may be visible to more teams (for example to a contractor team when they have been assiged work for that facility)._ ([See FacilitySchema](models_Facilities_imports_schemas_FacilitySchema.jsx.html))
* **Requests** _The request is the lifeblood of this application. It is a work request or job request sent from an FM to a contractor but may also be viewed as a quote or invoice. Requests have one team, one supplier and one facility._ ([See RequestSchema](models_Requests_imports_schemas_RequestSchema.jsx.html))

**Secondary**

* **Messages** _Part of a simple discussion mechanism. Each message is attached to an "inbox" which can be any sort of collection. A collection can be turned into an inbox, capable of recieving messages, using the MessagesMixin._ ([See MessageSchema](models_Messages_imports_schemas_MessageSchema.jsx.html))
* **Notifications** _Main collection used for implementing FMCs notification system._ ([See NotificationSchema](models_Users_imports_schemas_UserSchema.jsx.html))
* **Documents** _Flexible documents which represent an actual real world physical document such as insurance policy or floor plan. Can be tagged against a team, facility, supplier or user._ ([See DocumentSchema](models_Documents_imports_schemas_DocumentSchema.jsx.html))
* **Files** _A CollectionFS collection using _the sadly deprecated [CollectionFS Package](https://github.com/CollectionFS/Meteor-CollectionFS). Used by thumbs and documents_ 

**Mixins**

In addition to the Mongo collections used by this application, a number of mixins are used that add functionality to the collections. [(See module:mixins)](module-mixins.html) These include:

* **Owners** _A mixin that adds an owner field to documents in the collection and add helpers related to saving and manipulating a document owner._ 
* **Members** _A mixin that allows the saving of user members with roles in a collection. Used extensively by [Roles](module-mixins_Roles.html)_ 
* **Roles** _A mixin that provides context aware analysis of the relation of a user to an object or series of objects. Used for highly nuanced RBAC._ 
* **Thumbs** _A mixin that adds a thumb field to documents in the collection and add helpers related to saving and manipulating a document thumb._
* **Areas** _Adds fields and helpers related to areas/location in a document. Used primarily by [Facilities](module-models_Facilities.html) but implemented as a mixin for potential reusability._
* **Services** _Adds fields and helpers related to services in a document. For [Facilities](module-models_Facilities.html) this is mainly [ServicesRequired](module-mixins_Services.ServicesRequiredEditor.html). For [Teams](module-models_Teams.html) it is primarily [ServicesProvided](module-mixins_Services.ServicesProvidedEditor.html). Also provides helpers for matching services required with services provided._


## Interface components

[TODO]

## Actions

All of the public user activities that change the state are grouped into actions. The action class is defined in `/modules/core/Actions/imports/Action.jsx`. Actions can be grouped. The action group class defined in `/modules/core/imports/ActionGroup.jsx`

There is a global instance of action group which is just called `Actions` defined in `/modules/core/Actions/imports/Actions.js`
All of the actions in the system are added to this global group, but some are also added to subgroups (like TeamActions or UserActions)

Action groups can be configured with permissions. All of the main permissions for the app are defined in `client/main.js` at the moment ( although in the long term this might not be the best place for them ). Permissions are added by calling the `addAccessRule` method of the relevant ActionGroup ( this will usually be the global `Actions` group ).

For example:
```Actions.addAccessRule( { 
	action: [
		'edit user',
		'login as user'
	],
	role: [ '*' ],
	rule: { alert: true }
} )
```

When creating an action - the individual action structure is pretty simple:
```const view = new Action( {
    name: 'view team',
    label: "View team",
    icon: 'fa fa-group',
    action: ( team ) => {
        Modal.show( {
            content: <TeamPanel item = { team } />
        } )
    }
} )
```

They can then be run from anywhere using:
```import { Actions } from '/modules/core/Actions';
Actions.run('migrate schema');```

## Pages and routing

[TODO]

## Deployment

FMC is hosted on AWS Sydney with the production server at [https://app.fmclarity.com](https://app.fmclarity.com).
Deployment is currently managed using [mupx](https://github.com/arunoda/meteor-up/tree/mupx). 

* **client** _Run only on client side, mainly layouts, views, stylesheets_
* **server** _Run only on server, somewhat limited as the bulk of the business logic runs on both client and server. Server-side only views such as email text is in this folder_
* **both** _Code for both client and server including the bulk of the schemas and business logic_
* **public** _Other files exposed to public including sprites and other core layout images, fonts, icons etc_
* **packages** _Internally developed sub-packages including packages for orm, rbac, documents and document explorer, Mongo document thumbnails and more_
