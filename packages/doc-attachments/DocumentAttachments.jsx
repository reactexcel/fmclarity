import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

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