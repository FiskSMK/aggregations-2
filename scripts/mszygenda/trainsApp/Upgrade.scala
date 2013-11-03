package com.trains.model.app
import com.trains.model._

object Upgrade {
  def main(args: Array[String]) {
    TrainsRepository.tagsMigration()
  }
}

// vim: set ts=4 sw=4 et:
