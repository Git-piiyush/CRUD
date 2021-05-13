const express = require('express');
const app = express();
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/farm', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongoose connected");
    })
    .catch((err) => {
        console.log("Mongoose not connected")
        console.log(err)
    })

const Product = require('./models/product');

app.use(express.urlencoded({ extended: true }))
const methodOverride = require('method-override');
const { findByIdAndDelete } = require('./models/product');
app.use(methodOverride('_method'));

app.listen(3000, () => {
    console.log("I am port 3000!!")
})

const categories = ['fruit', 'dairy', 'vegetable'];

app.get('/shop', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category: category })
        res.render('products/index', { products, category })

    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' });
    }


})

app.get('/shop/new', (req, res) => {
    res.render('products/new', { categories })
})


app.post('/products', async (req, res) => {

    const p = new Product(req.body)
    await p.save();
    res.redirect(`/shop/${p._id}`);

})

app.get('/shop/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/show', { product })
})

app.get('/shop/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/edit', { product, categories })
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    res.redirect(`/shop/${product._id}`)
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id)
    res.redirect('/shop');
})
