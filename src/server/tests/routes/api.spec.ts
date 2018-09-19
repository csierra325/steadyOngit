import {expect} from 'chai';
import {mock, instance, anyString, when} from 'ts-mockito';
import {of as Observableof} from 'rxjs';
import * as request from 'supertest';
import * as express from 'express';

describe('/api', () => {
    let app;
    before(() => {
        app = express();
        app.use('/api', require('../../routes/api')({}));
        app.use((req, res) => res.status(404).send('not a valid endpoint'));
    });

    it('should 404 on unknown endpoint', (done) => {
        request(app)
        .get('/notreal')
        .expect(404)
        .end(() => done());
    });
});
