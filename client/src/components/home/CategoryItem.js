import React from 'react';
import { Link } from 'react-router-dom';

import URL from '../../helper/helper_url';

function CategoryItem({
    category,
    idx
}) {
    return (
        <Link to={URL.service.search + `?category=${category.id}`} key={category.id}>
            <div className="category" tabIndex={idx}>
                <div className="category-box">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <span className="icon">
                                        <img src={require("../../assets/img/" + category.img).default}/>
                                    </span>
                                </td>
                                <td>
                                    <span>
                                        {category.name}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Link>
    )
}

export default CategoryItem;