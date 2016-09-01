Documents = ORM.Collection( "Files", DocumentSchema );

if ( Meteor.isServer )
{
    Meteor.publish( 'docs', function()
    {
        return Documents.find(
        {} );
    } );
}
else
{
    Meteor.subscribe( 'docs' );
}

//this should be a wrapper for CollectionFS, then we can, in theory, unplug it in due course
//come to think of it could have a wrapper for user as well - would fix that profile malarkey

Documents.methods(
{
    create:
    {
        authentication: true,
        method: RBAC.lib.create.bind( Documents )
    },
    save:
    {
        authentication: true,
        method: RBAC.lib.save.bind( Documents )
    },
    destroy:
    {
        authentication: true,
        method: RBAC.lib.destroy.bind( Documents )
    }
} )
