README.md
=========

## Summary

A simple REST API made with node, sqlite3 and restify to provide a CRUD.

## Running

NPM should run the postinstall script to create the initial sqlite db file (is a single file).
Server can be started using node app.js

### Configuration

Very self-explanatory config.json is included.

## List

```cURL
curl -v -X GET http://localhost:8080/todos
```

## Create

```cURL

curl -v -X POST -H "Content-Type: application/json" -d '{"description": "Lorem Ipsum", "isDone": false}' http://localhost:8080/todos

```

## Delete

```cURL
curl -v -X DELETE http://localhost:8080/todos/<id>
```

## Update

```cURL
curl -v -X PUT -H "Content-Type: application/json" -d '{"description": "Lorem Ipsum", "isDone": false}' http://localhost:8080/todos/<id>
```