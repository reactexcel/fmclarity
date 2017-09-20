import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


// http://json-schema.org/
// http://guides.rubyonrails.org/association_basics.html

export default ORM = {
	collections: {},
	HasOne: 1,
	OneToOne: 1,
	BelongsTo: 2,
	HasMany: 3,
	OneToMany: 3,
	ManyToOne: 3,
	ManyToMany: 4,
	HasAndBelongsToMany: 4
};
