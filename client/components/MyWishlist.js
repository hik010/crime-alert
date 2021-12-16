import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getAllLists } from '../store/all_wishlists';
import { getWishlist, setWishlist } from '../store/single_wishlist';
import AddItemForm from './AddItemForm';

const MyWishlist = () => {
  const allLists = useSelector((state) => state.allLists);
  const selectedList = useSelector((state) => state.singleWishlist);
  const dispatch = useDispatch();

  useEffect(() => {
    // get all my lists
    dispatch(getAllLists());
  }, []);

  useEffect(() => {
    // get all my lists
    if (allLists[0]) {
      dispatch(setWishlist(allLists[0]));
    }
  }, [Object.keys(allLists).length]);

  return (
    <div className="my-wishlist">
      <h4 className="mt-5">My Wishlist</h4>
      {JSON.stringify(allLists) !== '{}' ? (
        <select className="form-select" aria-label="Default select example">
          {allLists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>
      ) : null}
      {selectedList.items ? (
        <div className="list-items d-flex mt-3 justify-content-start">
          {selectedList.items.map((item) => (
            <div className="single-item d-flex" key={item.id}>
              <img style={{ width: '15%' }} src={item.image}></img>
              <section className="item-info ms-2 w-25">
                <a href={item.url}>
                  <h5>{item.title}</h5>
                </a>
                <p id="price">${item.price}</p>
                <p id="rating">Star: {item.rating}</p>
                <p>{item.num_sales}</p>
              </section>
            </div>
          ))}
          <button
            className="btn btn-success"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#addItem"
          >
            Add
          </button>
          {/* <AddItemForm /> */}
          <div className="modal fade" id="addItem" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Modal title
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <AddItemForm />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MyWishlist;
