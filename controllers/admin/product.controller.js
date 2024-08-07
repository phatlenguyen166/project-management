const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
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



    const products = await Product.find(find).sort({ position: "desc" }).limit(objectPagination.limitItem).skip(objectPagination.skip);

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



    const products = await Product.find(find)

        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

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
    req.flash(
        "info", "Cập nhật trạng thái thành công!"
    )
    res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash(
                "info", `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`
            )
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash(
                "info", `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`
            )
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
            req.flash(
                "info", `Đã xóa thành công ${ids.length} sản phẩm!`
            )
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
            req.flash(
                "info", `Đã đổi vị trí ${ids.length} thành công!`
            )
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

    req.flash(
        "info", `Đã xóa thành công sản phảm!`
    )
    res.redirect("back");
}

// [DELETE] /admin/products/create
module.exports.create = (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Danh sách sản phẩm",
    });
}
module.exports.createPost = async (req, res) => {
    console.log(req.file);
    
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    // console.log(req.body);
    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        // console.log(countProducts);
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    req.body.thumbnail = `/uploads/${req.file.filename}`;
    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}