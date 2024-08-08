const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });

    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(2);
        return item;
    })

    // console.log(products


    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });
}

module.exports.detail = async (req, res) => {
    try {
        let find = {
            deleted: false,
            slug: req.params.slug
        }

        const product = await Product.findOne(find);

        console.log(product);
        
        res.render("client/pages/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        });
    } catch (error) {
        res.redict("/products")
    }

    res.render("client/pages/products/detail", {
        pageTitle: "Chi tiết sản phẩm"
    });
}