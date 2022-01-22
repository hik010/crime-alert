import axios from 'axios';

const SET_WISHLIST = 'SET_WISHLIST';
const CLEAR_WISHLIST = 'CLEAR_WISHLIST';
const ADD_ITEM = 'ADD_ITEM';
const DELETE_ITEM = 'DELETE_ITEM';

const TOKEN = 'token';

// ACTION CREATORS
export const setWishlist = (listObj) => {
  return {
    type: SET_WISHLIST,
    payload: listObj,
  };
};

export const clearWishlist = () => {
  return {
    type: CLEAR_WISHLIST,
  };
};

// adding item to current wishlist
const addItem = (newItem) => {
  return {
    type: ADD_ITEM,
    payload: newItem,
  };
};

// deleting item to current wishlist
const deleteItem = (deletedItemId) => {
  return {
    type: DELETE_ITEM,
    payload: deletedItemId,
  };
};

export const getWishlist = (list) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem(TOKEN);
    try {
      if (token) {
        const res = await axios.get(`/api/wishlist/${list.id}`, {
          headers: {
            authorization: token,
          },
        });
        dispatch(setWishlist(res.data));
      }
    } catch (err) {
      console.error('err in getWishlist', err);
    }
  };
};

export const addItemThunk = (itemData) => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem(TOKEN);
    try {
      if (token) {
        let wishlistId = getState().singleList.id;
        const res = await axios.post(
          `/api/wishlist-item`,
          { wishlistId, itemData },
          {
            headers: {
              authorization: token,
            },
          }
        );
        console.log(res.data);
        dispatch(addItem(res.data));
      }
    } catch (err) {
      console.error('err in addItemThunk', err);
    }
  };
};

export const deleteItemThunk = (itemData) => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem(TOKEN);
    try {
      if (token) {
        console.log(token);
        let wishlistId = getState().singleList.id;
        const { data } = await axios.delete('/api/wishlist-item', {
          headers: {
            authorization: token,
          },
          data: { wishlistId, itemData },
        });
        dispatch(deleteItem(data.itemId));
      }
    } catch (err) {
      console.error('err in deleteItemThunk', err);
    }
  };
};

// reducer
// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = {}, action) {
  switch (action.type) {
    case SET_WISHLIST:
      return action.payload;
    case CLEAR_WISHLIST:
      return {};
    case ADD_ITEM: {
      let prevItems = state.items;
      return { ...state, items: [...prevItems, action.payload] };
    }
    case DELETE_ITEM: {
      let newItems = state.items.filter((item) => item.id != action.payload);
      return { ...state, items: newItems };
    }
    default:
      return state;
  }
}
