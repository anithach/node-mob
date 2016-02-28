/**
 * Description: Purchase Orders schema.
 * Version: v 0.0.1
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var poSchema = new Schema(
		{
			bqcode      : { type: String, required: true },
            ponum       : { type: String, required: true },
			prodcode    : { type: String, required: true },
			proddate    : { type: String, required: true },
			company     : { type: String, required: true },
			vendor      : { type: String, required: true },
			fdaregno    : { type: String, required: true },
			traceid     : { type: String, required: true },
			shrimppp    : { type: String, required: true },
			shrimptype  : { type: String, required: true },
			packing     : { type: String, required: true }
		},
        { collection : 'PURCHASEORDERS' });


var PO = mongoose.model('PURCHASEORDER', poSchema);

poSchema.methods.getDocs = function(query) 
{
	PO.find(query, function(err, result) 
			 {
			      if (!err) 
			      {
			    	  return result;
			      } 
			      else 
			      {
			    	  return err;
			      }
			 });	
};

module.exports = mongoose.model('PURCHASEORDER');