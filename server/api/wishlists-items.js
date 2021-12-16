const { requireToken } = require('./gatekeeping');

const {
  models: { Item, Wishlist_Item },
} = require('../db');
const Wishlist = require('../db/models/Wishlist');

const router = require('express').Router();

module.exports = router;

// POST /api/wishlist-item
router.post('/', requireToken, async (req, res, next) => {
  try {
    // create item with item data
    const { wishlistId, itemData } = req.body;
    // if itemData.id exsits, no need to create
    let item;
    if (!itemData.id) {
      item = await Item.create(itemData);
    } else item = itemData;

    // create entry in wishlist-items
    let new_entry = await Wishlist_Item.create({
      itemId: item.id,
      wishlistId: wishlistId,
      // quantity: itemData.quantity,
      // note: itemData.note,
    });

    let itemReturn = { ...item.dataValues, wishlist_item: new_entry };

    res.json(itemReturn);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// PUT /api/wishlist-item update quantity or note
router.put('/', requireToken, async (req, res, next) => {
  try {
    // delete one entry, need to know item id and wishlist id
    const { wishlistId, itemData } = req.body;
    let [numUpdated, updated] = await Wishlist_Item.update(itemData, {
      where: {
        wishlistId,
        itemId: itemData.id,
      },
      returning: true,
    });

    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/wishlist-item
router.delete('/', requireToken, async (req, res, next) => {
  try {
    // delete one entry, need to know item id and wishlist id
    const { wishlistId, itemData } = req.body;
    let toDestroy = await Wishlist_Item.findOne({
      where: {
        wishlistId,
        itemId: itemData.id,
      },
    });

    await toDestroy.destroy();
    res.json(toDestroy);
  } catch (e) {
    next(e);
  }
});
