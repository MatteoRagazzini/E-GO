mongosh E-GO-db --eval "printjson(db.dropDatabase())"
mongorestore -d E-GO-db ./E-GO-db