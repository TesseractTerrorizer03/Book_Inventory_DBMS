import React, { useState, useEffect } from 'react';
import './Topbooks.css'; // Make sure to import the CSS file
import UserNavbar from '../Navbar_user.js';
import axios from 'axios';

const MyReviews = () => {
    const custId = 2;
    const [orders, setOrders] = useState([]);
    const [post, setPost] = useState({
        book_id: '',
        review_text: '',
        rating: 0, // Default to 0
        user_id: custId, // Assuming user_id is the current customer's id
    });
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        // Fetch orders from your API
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/my-reviews?customer_id=${custId}`);
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error.message);
            }
        };

        fetchData();
    }, [custId]);

    const handleAddRating = async (book_id) => {
        setPost({
            book_id,
            review_text: '',
            rating: 0,
            user_id: custId,
        });

        // Show the review form
        setShowReviewForm(true);
    };

    const handleSubmitReview = async () => {
        const { book_id, review_text, rating, user_id } = post;
        const reviewDate = new Date().toISOString(); // Current date in ISO format

        const jsonarr = {
            BookId: book_id,
            ReviewText: review_text,
            ReviewDate: reviewDate,
            Rating: rating,
            UserId: user_id,
        };

        try {
            const response = await axios.post('http://localhost:3000/addreview', jsonarr, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response.data);

            // After adding the review, you might want to update the state to reflect the changes
            // For example, you could fetch the updated reviews or update the local state directly
            // based on the response.

            // // Refetch the orders to update the UI
            // const updatedResponse = await axios.get(`http://localhost:3000/my-reviews?customer_id=${custId}`);
            // setOrders(updatedResponse.data.orders);

            // Hide the review form
            setShowReviewForm(false);

            // Clear the review fields
            setPost({
                ...post,
                review_text: '',
                rating: 0,
            });
        } catch (error) {
            console.error('Error adding review:', error.message);
        }
    };

    const shouldDisplay = (rating) => rating == null;

    return (
        <div>
            <UserNavbar />
            <h2>My Reviews</h2>
            <div>
                <h3>My Orders</h3>
                <ul>
                    {orders.map((order) => (
                        <li key={order.order_id}>
                            {order.title} -{' '}
                            {shouldDisplay(order.rating) && (
                                <>
                                    <button onClick={() => handleAddRating(order.book_id)}>Add Review</button>
                                    {order.review_text && <p>{order.review_text}</p>}
                                    {shouldDisplay(order.rating) && <p>Rating: {order.rating}</p>}
                                </>
                            )}
                            {!shouldDisplay(order.rating) && (
                                <>
                                    {order.review_text && <p>{order.review_text}</p>}
                                    {<p>Rating: {order.rating}</p>}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {showReviewForm && (
                <div>
                    <h3>Add/Edit Review</h3>
                    <label>Review Text:</label>
                    <textarea
                        rows="4"
                        cols="50"
                        limit="500"
                        value={post.review_text}
                        onChange={(e) => setPost({ ...post, review_text: e.target.value })}
                    />
                    <label>Rating (0 to 5):</label>
                    <input
                        type="number"
                        value={post.rating}
                        onChange={(e) => setPost({ ...post, rating: parseInt(e.target.value) })}
                        min="0"
                        max="5"
                    />
                    <button onClick={handleSubmitReview}>Submit Review</button>
                </div>
            )}
        </div>
    );
};

export default MyReviews;
