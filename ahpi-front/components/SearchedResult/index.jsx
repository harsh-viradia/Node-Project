import React from "react"

import LayoutWrapper from "../../shared/wrapper/layoutWrapper"
import SearchedResultContent from "./SearchedResultContent"

const SearchedResult = () => {
  return (
    <LayoutWrapper>
      <div className="container">
        <h1 className="font-bold mt-9 mb-9">10,000 results for “artificial intelligence”</h1>
        <SearchedResultContent relatedSearches />
      </div>
    </LayoutWrapper>
  )
}

export default SearchedResult
