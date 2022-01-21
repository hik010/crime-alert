const router = require('express').Router();
const {
  models: { Wishlist, Item },
} = require('../db');
const { requireToken } = require('./gatekeeping');

module.exports = router;

// GET /api/wishlist/me
router.get('/me', requireToken, async (req, res, next) => {
  try {
    const allLists = await Wishlist.findAll({
      where: { userId: req.user.id, receiver: 'me' },
      include: [Item],
    });
    res.json(allLists);
  } catch (err) {
    next(err);
  }
});

// GET /api/wishlist/others
router.get('/others', requireToken, async (req, res, next) => {
  try {
    const allLists = await Wishlist.findAll({
      where: { userId: req.user.id, receiver: 'others' },
      include: [Item],
    });
    res.json(allLists);
  } catch (err) {
    next(err);
  }
});

// GET /api/wishlist/:id
router.get('/:id', async (req, res, next) => {
  try {
    const singleList = await Wishlist.findOne({
      where: { id: req.params.id },
      include: [Item],
    });
    res.json(singleList);
  } catch (err) {
    next(err);
  }
});

// POST /api/wishlist/me => adding a new wishlist for me
router.post('/me', requireToken, async (req, res, next) => {
  try {
    // make a list for me by default
    // make a list for someone else
    const singleList = await Wishlist.create({
      ...req.body,
      userId: req.user.id,
      receiver: 'me',
    });
    res.json(singleList);
  } catch (err) {
    next(err);
  }
});
// POST /api/wishlist/others => adding a new gift list for others
router.post('/others', requireToken, async (req, res, next) => {
  try {
    // make a list for me by default
    // make a list for someone else
    const singleList = await Wishlist.create({
      ...req.body,
      userId: req.user.id,
      receiver: 'others',
    });
    res.json(singleList);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/wishlist/:id => will delete the list + delete wishlist_items entries
router.delete('/:id', async (req, res, next) => {
  try {
    const singleList = await Wishlist.findOne({
      where: { id: req.params.id },
      include: [Item],
    });
    await singleList.destroy();
    res.json(singleList);
  } catch (err) {
    next(err);
  }
});
