FM Clarity is a commercial SaaS app for facility management. It is written in Meteor (currently supports 1.3.2.4) with interface components rendered primarily using ReactJS. The back end is driven by MongoDB (currently version 2.6) with a custom ORM package (fmc:orm) which uses [dburles:collection-helpers](https://github.com/dburles/meteor-collection-helpers) to bind helper functions to documents on retrieval and uses meteor methods to implement custom rbac (fmc:rbac).

For more information on the database architecture see [schema.md](schema.md)

## Installation

Requires meteor, node, npm.

```bash
cd fm-clarity
meteor install
npm install
meteor
```

## Application structure

The application structure loosely follows that laid out in [meteor-react-boilerplate](https://github.com/AdamBrodzinski/meteor-react-boilerplate).

* **client** _Run only on client side, mainly layouts, views, stylesheets_
* **server** _Run only on server, somewhat limited as the bulk of the business logic runs on both client and server. Server-side only views such as email text is in this folder_
* **both** _Code for both client and server including the bulk of the schemas and business logic_
* **public** _Other files exposed to public including sprites and other core layout images, fonts, icons etc_
* **packages** _Internally developed sub-packages including packages for orm, rbac, documents and document explorer, Mongo document thumbnails and more_