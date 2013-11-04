package com.trains.model

import com.mongodb.casbah.Imports._
import scala.collection.mutable.HashMap
import com.mongodb._
import Database._

object TrainsRepository {
  def countTags = {
    val tagStats = new HashMap[Any, Long]()
    val query = new BasicDBObject()
    val projection = new BasicDBObject()

    projection.put("Tags", 1)

    for (train <- collection.find(query, projection)) {
      train("Tags") match {
        case tags: BasicDBList => {
          for (tag <- tags) {
            val occurences = tagStats.getOrElse(tag, 0L)
            tagStats.update(tag, occurences + 1L)
          }
        }
      }
    } 

    (tagStats.keys.size, tagStats.foldLeft(0L)(_ + _._2))
  }

  def tagsMigration() {
    for (train <- collection.find()) {
      changeTagsToArray(train)
    }
  }

  private def changeTagsToArray(obj: MongoDBObject) = {
    val tagsArr = obj("Tags") match {
      case null => Array[String]()
      case tags: BasicDBList => tags
      case tags: String => tags.trim.split(' ')
      case tags => Array(tags.toString())
    }

    val tagsUpdate = $set("Tags" -> tagsArr)
    collection.update(idQuery(obj), tagsUpdate, multi=true)
  }

  private def idQuery(obj: MongoDBObject) = {
    MongoDBObject("_id" -> obj("_id"))
  }
}

// vim: set ts=4 sw=4 et:
