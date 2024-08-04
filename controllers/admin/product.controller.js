const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
// [GET] /admin/products
module.exports.index = async (req, res) => {
    // Filter status
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
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItem: 4
    },
        req.query,
        countProducts
    )
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

module.exports.deleted = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: true

    }
    if (req.query.status) {
        find.status = req.query.status;
    }

    const objecSearch = searchHelper(req.query);

    if (objecSearch.regex) {
        find.title = objecSearch.regex;
    }

    // Pagination 
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItem: 4
    },
        req.query,
        countProducts
    )
    // End Pagination 



    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);

    res.render("admin/pages/products/productsDeleted", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objecSearch.keyword,
        pagination: objectPagination
    });

}

// // [PATCH] /admin/products/deleted/restore/:id
module.exports.restoreItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({ _id: id, }, { deleted: false })
    res.redirect("back");
};

module.exports.restoreManyProducts = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
<<<<<<< HEAD
    
=======
>>>>>>> 90d239f9ab3e58041ee8f9bfd3d20cb982e2f778
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            break;
        case "delete-all":
            await Product.updateMany(
                {
                    _id: { $in: ids }
                },
                {
                    deleted: true,
                    deleteAt: new Date()
                });
            break;
        default:
            break;
    }
    res.redirect("back");
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;

    await Product.updateOne({ _id: id, }, { status: status })
    res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    console.log(ids);
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            break;
        case "delete-all":
            await Product.updateMany(
                {
                    _id: { $in: ids }
                },
                {
                    deleted: true,
                    deleteAt: new Date()
                });
            break;
        default:
            break;
    }
    res.redirect("back");
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() });

    res.redirect("back");
}
