const { Router } = require("express");
const userController = require('../controllers/userController.js');
const messageController = require('../controllers/messageController.js');
const userRouter = Router();

userRouter.get('/signUp', userController.createUserGet);

userRouter.get('/memberStatus', userController.createMemberGet);
userRouter.post('/memberStatus', userController.createMemberPost);

// userRouter.get('/login', userController.logInGet);
// userRouter.post('/memberStatus', userController.logInPost);


userRouter.get('/message', messageController.createMessageGet);
userRouter.post('/message', messageController.createMessagePost);

userRouter.get('/message/delete/:id', messageController.deleteMessageGet);

// usersRouter.get("/users/:id/update", usersController.userUpdateGet);
// usersRouter.post("/users/:id/update", usersController.userUpdatePost);

// catRouter.get("/edit/:id/edit", categoryController.updateCategoryGet);
// catRouter.post("/edit/:id", categoryController.updateCategoryPost);
// catRouter.get("/delete/:id", categoryController.deleteCategory);
// catRouter.get("/products/new", productController.createProductGet);
// catRouter.post("/products/new", productController.createProductPost);
// catRouter.get("/products", categoryController.getCatProducts);
// catRouter.get("/new", categoryController.createCategoryGet);
// catRouter.post("/new", categoryController.createCategoryPost);

// catRouter.get("/products/edit/:id", productController.updateProductGet);
// catRouter.post("/products/edit/:id", productController.updateProductPost);
// catRouter.get("/products/delete/:id", productController.deleteProduct);
// catRouter.get("/", categoryController.getCategories);


module.exports = userRouter;