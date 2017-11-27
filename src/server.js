/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2017 EMBL - European Bioinformatics Institute
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Basic Setup
var http     = require('http'),
    express  = require('express'),
    mysql    = require('mysql')
    parser   = require('body-parser'),
        _    = require('underscore');

// Database Connection
var pool  = mysql.createPool({
    host     : 'ensembldb.ensembl.org',
    port     : 3306,
    user     : 'anonymous',
    database : 'ensembl_website_90',
    connectionLimit : 10
});


// Setup express
var app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 5000);


app.get('/', function(req, res) {
    res.status(200).sendFile(__dirname + '/index.html');
});


//get gene names suggestions
app.get('/gene_suggest', function (req, res) {
    var query = req.query.query,
        species = req.query.species,
        limit = req.query.limit ? parseInt(req.query.limit): 2;

    if(!_.isUndefined(query) && !_.isUndefined(species) && !_.isUndefined(limit)){
        pool.getConnection(function(err, connection) {
            if(!err){
                connection.query('SELECT * FROM gene_autocomplete WHERE species = ? and display_label LIKE ? LIMIT ?', [species,query+'%',limit], function(err, rows, fields) {
                    connection.release();
                    if (!err){
                        var response = [];
                        if (!_.isEmpty(rows)) {
                            var genes = []
                            for (var i = 0; i < rows.length; i++) {
                                var row = rows[i];
                                genes[i] = row.display_label;
                            }
                            response.push({'result' : 'success', 'data' : genes});
                        } else {
                            response.push({'result' : 'error', 'msg' : 'No Results Found'});
                        }
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).send(JSON.stringify(response));
                    } else {
                        res.status(400).send(err);
                    }
                });
            } else {
                res.status(400).send(err);
            }

        });

    }

});

// Create server
 var httpServer = http.createServer(app).listen(app.get('port'), function(){
    console.log('Server listening on port ' + app.get('port'));
});

process.on('SIGINT', function () {
    console.log("Closing");
    httpServer.close();
    pool.end();
    process.exit(0)
});



