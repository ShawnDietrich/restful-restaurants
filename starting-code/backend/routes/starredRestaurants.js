const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
router.get("/:id", (req, res) => {
  const id = req.params;

  const restaurant = ALL_RESTAURANTS.find((restaurant) => restaurant.id === id);

  if (!restaurant) {
    res.status(404).send("Not found");
    return;
  }
  res.json(restaurant);
});

/**
 * Feature 8: Adding to your list of starred restaurants.
 */
router.post("/", (req, res) => {
  //read in name of restaurant
  const { name, comment } = req.body;

  //find the restaurant in the list first
  const foundRestaurant = STARRED_RESTAURANTS.find(
    (restaurant) => restaurant.name === name
  );

  if (!foundRestaurant) {
    res.status(404).send("Restaurant Not Found");
    return;
  }

  //create a new ID for the stared restaurant
  const newId = uuidv4();
  //create a new record for the starred restaurant
  const starredRestaurant = {
    id: foundRestaurant.id,
    restaurantId: newId,
    comment: comment,
  };
  //push the new record to the starred restaurant array
  STARRED_RESTAURANTS.push(starredRestaurant);

  //send result to the frontend
  res.json(starredRestaurant);
});

/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
router.delete("/:id", (req, res) => {
  const id = req.params;

  //filter out the restauratnt to delete
  const newStarredRestaurant = STARRED_RESTAURANTS.filter(
    (restaurant) => restaurant.id !== id
  );
  //check if restaurant was removed
  if (STARRED_RESTAURANTS.length === newStarredRestaurant.length) {
    res.status(404).send("Not found");
  }
  STARRED_RESTAURANTS = newStarredRestaurant;
  res.sendStatus(200);
});

/**
 * Feature 10: Updating your comment of a starred restaurant.
 */
router.put("/:id", (req, res) => {
  const id = req.params;
  const { comment } = req.body;

  const restaurant = STARRED_RESTAURANTS.find(
    (restaurant) => restaurant.id === id
  );

  if (!restaurant) {
    res.sendStatus(404);
    return;
  }
  restaurant.comment = comment;
  res.sendStatus(200);
});

module.exports = router;
