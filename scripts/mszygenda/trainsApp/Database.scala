package com.trains.model
import com.mongodb.casbah.Imports._

object Database {
  val db = MongoClient("localhost", 27017)("nosql")
  val collection = db("trains")
}

// vim: set ts=4 sw=4 et:
