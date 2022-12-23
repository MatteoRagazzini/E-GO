mongosh bezkoder_db --eval "printjson(db.dropDatabase())"
mongorestore -d bezkoder_db ./bezkoder_db