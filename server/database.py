from pymongo import MongoClient, ASCENDING, DESCENDING
import os

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["CoreForge"]

users_collection = db["users"]
benchmarks_collection = db["benchmarks"]
benchmarks_collection.create_index([("user_id", ASCENDING), ("timestamp", DESCENDING)])