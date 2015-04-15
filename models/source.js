var mongoose = require('mongoose');

// Creates a new Mongoose Schema object
var Schema = mongoose.Schema;

var SourceSchema = new Schema({
	name: { type: String, required: false },
	url: { type: String, required: false },
	format: { type: String, required: true},
	filePath: { type: String, required: false},
	projection: { type: String, required: false},
	geometry: Schema.Types.Mixed,
	projections: Schema.Types.Mixed
});

function transform(source, ret, options) {
	ret.id = ret._id;
	delete ret._id;
	delete ret.__v;
	delete ret.filePath;
}

SourceSchema.set("toJSON", {
  transform: transform
});

var Source = mongoose.model('Source', SourceSchema);
exports.sourceModel = Source;

exports.getSources = function(options, callback) {
  var query = options || {};
	Source.find(query).exec(function(err, sources) {
    if (err) {
      console.log("Error finding sources in mongo: " + id + ', error: ' + err);
    }
    callback(err, sources);
  });
}

exports.getSourceById = function(id, callback) {
  Source.findById(id).exec(function(err, source) {
    if (err) {
      console.log("Error finding source in mongo: " + id + ', error: ' + err);
    }
    callback(err, source);
  });
}

exports.createSource = function(source, callback) {
	Source.create(source, callback);
}

exports.deleteSource = function(source, callback) {
  source.remove(function(err, removedSource) {
    if (err) console.log("Error removing source: " + err);
    callback(err, removedSource);
  });
}