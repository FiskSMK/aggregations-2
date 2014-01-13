package com.trains.app
import com.trains.model._

object Count {
  def main(args: Array[String]) {
    println("(Unique Tag Count, Total Count) = " + TrainsRepository.countTags)
  }
}

// vim: set ts=4 sw=4 et:
