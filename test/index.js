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
var expect  = require("chai").expect;
var request = require("request");


describe("gene_suggest", function() {
    var url = "http://localhost:5000/gene_suggest?query=a&species=homo_sapiens&limit=10";

    it("returns status 200", function(done) {
        request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    it("returns with 10 gene names", function(done) {
        request(url, function (error, response, body) {
            // parsed response body as js object
            var data = JSON.parse(body)
            expect(data).to.be.an('Array');
            // raw response
            // console.log(response);
            done();
        });
    });
});