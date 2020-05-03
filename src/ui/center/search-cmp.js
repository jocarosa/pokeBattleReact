import React from 'react';
import styled from 'styled-components';

const SearchStyle  = styled.div`

`;


 const Search = ({onChange})=>(
    <SearchStyle>
        <input
            className='styleInputSearch'
            type = "text"
            onChange = {onChange}
            placeholder="Search Pokemon..."
        />
    </SearchStyle>
    
)

export default Search;