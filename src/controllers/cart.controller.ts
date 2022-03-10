import prisma from "../database/db";
import { getOrderByCartId, validateOrder } from "./order.controller";

export async function getInfoCart(total: any, productos: any, userId: any) {
  try {
    const cart = await prisma.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
        ordersId: [],
        total: 2,
      },
    });
    await validateOrder(userId, cart.id);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getCarritoUser = async (userId: string) => {
  try {
    // buscamos el carrito del usuario
    let carrito = await prisma.cart.findUnique({where: { userId }})
    
    if(!carrito) throw new Error()
    if(!Object.keys(carrito!.ordersId).length) return carrito

    return await getOrderByCartId(carrito!.ordersId)
  } catch (error) {
    return null
  }
}

export const saveNewCarrito = async (userId: string) => {
  try {
    // let carrito = await prisma.cart.upsert({
    //   where: {
    //     userId
    //   },
    //   create: {

    //   },
    //   update: {}
    // })
  } catch (error) {
    
  }
}