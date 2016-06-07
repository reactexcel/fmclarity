# FM Clarity Web Application

FM Clarity is a commercial SaaS app for facility management. It is written in Meteor (currently supports 1.3.2.4) with interface components rendered primarily using ReactJS. The back end is driven by MongoDB (currently version 2.6) with a custom ORM package (fmc:orm) which uses dburles:collection-helpers to bind helper functions to documents on retrieval and uses meteor methods to implement custom rbac (fmc:rbac).

For more information on the database architecture see [schema.md]

## Installation

Requires meteor, node, npm.

```bash
cd fm-clarity
meteor install
npm install
meteor
```

## Application structure