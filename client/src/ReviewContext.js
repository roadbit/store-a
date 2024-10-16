import React, { createContext, useState, useContext } from 'react';

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [reviewCount, setReviewCount] = useState(0);

  return (
    <ReviewContext.Provider value={{ reviewCount, setReviewCount }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  return useContext(ReviewContext);
}