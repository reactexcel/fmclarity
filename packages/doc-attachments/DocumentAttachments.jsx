DocAttachments = {
	register:registerCollection,
	FileExplorer:FileExplorer
}

var Attachments = null;

function registerCollection(collection,opts) {
	Attachments = opts.repo;

	collection.helpers({
	})
}