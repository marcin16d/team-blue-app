import React from 'react';

import './Category.scss';

function Category({ name, icon }) {
  return (
      <div className="category" xs={12} md={6} lg={3} xl={3} >
        <i className={icon} />
        <span className="category-name">{name}</span>
      </div>
  );
}

export default Category;