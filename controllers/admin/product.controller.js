const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false

    }
    if (req.query.status) {
        find.status = req.query.status;
    }

    const objecSearch = searchHelper(req.query);

    if (objecSearch.regex) {
        find.title = objecSearch.regex;
    }

    // Pagination 
    let objectPagination = {
        currentPage: 1,
        limitItem: 4
    };

    if (req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page);
    } else {

    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;

    const countProducts = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProducts / objectPagination.limitItem);
    objectPagination.totalPage = totalPage;
    console.log(totalPage);

    // End Pagination 



    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objecSearch.keyword,
        pagination: objectPagination
    });

}