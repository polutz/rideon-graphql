import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Schema from './schema';
import GraphQlHttp from 'express-graphql';
import {MongoClient} from 'mongodb';
import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';
import * as fs from 'fs';

import {UserApp} from 'ptz-user-app';
import {UserRepository} from 'ptz-user-repository';

var app = express();
console.log('starting server');

const MONGO_URL = 'mongodb://localhost:27017/rideon',
	PORT = 3000;

(async () => {
    try{
        var db = await MongoClient.connect(MONGO_URL);
        var userApp = UserApp(UserRepository(db));
        var schema = Schema(userApp);

        app.use('/', GraphQlHttp({
            schema,
            graphiql: true
        }));

        app.listen(PORT, () => console.log('Listening on port ' + PORT));

        //Generate schema.json
        var json = await graphql(schema, introspectionQuery);
        fs.writeFile('./dist/schema.json', JSON.stringify(json, null, 2), err => {
            if(err) throw err;

            console.log('Json schema created!');
        });  
    }
    catch(e){
        console.log(e);
    }
})();
