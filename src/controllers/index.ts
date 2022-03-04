/**
 * Required External Modules and Interfaces
 */
 import { Request, Response } from "express";
 import { PrismaClient } from "@prisma/client";
 import { allUsersList, saveNewUser } from "./user.controller";
 import {
  getProducts,
   saveNewProduct,
   filterbyCategory,
   filterByName,
   filterById,
 } from "./product.controller";
 
 
 const prisma: PrismaClient = new PrismaClient();
 prisma.$connect().then(() => console.log("listo"));
 
 export const getAllUsers = async (req: Request, res: Response) => {
   try {
     let pageBase: number = 0,
       myPage: string = req.query.page as string;
     const pageAsNumber: number = parseInt(myPage);
 
     if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
       pageBase = pageAsNumber;
     }
     
     const userList = await allUsersList(prisma, pageBase);
     if (!userList) throw new Error();
 
     res.status(200).json(userList);
   } catch (error) {
     console.log(error)
     res.status(500).json({ msg: "Error" });
   }
 };
 
 /**
  * Params
  *      all shops
  * id   un tienda
  *
  */
 export const getShops = async (req: Request, res: Response) => {
   try {
     const { isShop } = req.query;
     if (isShop) {
     }
   } catch (error) {}
 };
 
 export const getAllProducts = async (req: Request, res: Response) => {
   try {
     await prisma.$connect();
     let filteredProducts = [];
     let { category } = req.query;
     let { name } = req.query;
     let { id } = req.query;
     
     const products = await getProducts(prisma);
     if (category) {
       filteredProducts = filterbyCategory(products, category);
       res.status(200).json(filteredProducts);
     } else if (name) {
       filteredProducts = filterByName(products, name);
      res.status(200).json(filteredProducts);
     } else if (id){
       filteredProducts = filterById(products, id);
       res.status(200).json(filteredProducts)
     }
     else {
       res.status(200).json(products);
     }
   } catch (error) {
     res.send(error);
   }
 };

 
 export const saveProduct = async (req: Request, res: Response) => {
   try {
    const {
      name,
      image,
      description,
      price,
      discount,
      stock,
      categoriesId,
      shopId,
    } = req.body;
    const data = {
      name,
      image,
      description,
      price,
      discount,
      stock,
      categoriesId,
      shopId,
    };
     const resultado = await saveNewProduct(prisma, req.body, data);
     console.log(resultado);
 
     res.json(resultado);
   } catch (error) {
     console.error(error);
     res.status(400).json({ msg: "error" });
   }
 };

 export const addUser = async (req: Request, res: Response) => {
try {
  const { userId, name, name_user, email, direction, rol, shopsId } = req.body;
  const data = { userId, name, name_user, email, direction, rol, shopsId }
  const user = await saveNewUser(prisma, data)
  res.status(200).send(user);
} catch (error) {
  console.error(error);
     res.status(400).json({ msg: "error" });
}
 }