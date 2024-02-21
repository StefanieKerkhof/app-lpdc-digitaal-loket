import express from "express";
import fs from "fs";
import { instanceSnapshot } from "./extra-instancesnapshots.js";
const app = express();

app.use(express.json({type:  ['application/json', 'application/ld+json']}));

const extraInstanceSnapshots = [];

function errorHandler(err, req, res, next) {
    if (err) {
        console.log(err);
        res.status(404).send();
    }
}

app.post('/instancesnapshot/:instanceId/:gearchiveerd', (req, res, next) => {
    try {
        const instanceId = req.params.instanceId;
        const gearchiveerd = req.params.gearchiveerd;
        const instanceSnapshotToAdd = instanceSnapshot(instanceId, gearchiveerd);
        if (instanceSnapshotToAdd) {
            extraInstanceSnapshots.push(instanceSnapshotToAdd);
            return res.status(200).json({
                id: instanceSnapshotToAdd.id,
                title: instanceSnapshotToAdd.titel["nl-BE-x-informal"]
            });
        } else {
            return res.sendStatus(400);
        }
    } catch (e) {
        next(e);
    }
});

app.get('/doc/instancesnapshot', (req, res, next) => {
    try {
        const pageNumber = Number(req.query.pageNumber) || 0;
        console.log(`page ${pageNumber} requested`);
        const page = fs.readFileSync(`./ldes-pages/page-${pageNumber}.json`, "utf8");
        const jsonLd = JSON.parse(page);
        jsonLd.member = jsonLd.member.concat(extraInstanceSnapshots);
        res.status(200).type('application/ld+json').json(jsonLd);
    } catch (e) {
        next(e);
    }
});

app.get('/InstanceJsonLdContext.jsonld', (req, res, next) => {
    console.log('')
    try {
        const page = fs.readFileSync(`./ldes-pages/InstanceJsonLdContext.jsonld`, "utf8");
        const jsonLd = JSON.parse(page);
        res.status(200).type('application/ld+json').json(jsonLd);
    } catch (e) {
        next(e)
    }
});

app.use(errorHandler);

app.listen(80, () => {
    console.log(`Instance stub listening on port 80`)
});

