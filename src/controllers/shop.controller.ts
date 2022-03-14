import prisma from "../database/db";
import { Shops } from "@prisma/client";

export async function saveNewShop(data: any) {
  try {
    let user: any = await prisma.users.findUnique({
      where: {
        id: data.userId,
      },
      select: {
        shopsId: true,
      },
    });
    if (user) {
      const newShop: any = await prisma.shops.create({ data: data });
      user.shopsId.push(newShop.id);

      const users = await prisma.users.update({
        where: {
          id: data.userId,
        },
        data: {
          shopsId: user.shopsId,
          rol: 1,
        },
      });

      return newShop;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function getShops(page: number) {
  try {
    const total = await prisma.shops.count();

    const shops: any = await prisma.shops.findMany({
      skip: 10 * page,
      take: 10,
    });
    const totalPages = Math.ceil(total / 10);
    if (shops)
      return {
        next: page < totalPages - 1 ? true : false,
        pagesTotal: totalPages,
        prev: page > 0 ? true : false,
        shops,
      };
  } catch (error) {
    return null;
  }
}

export async function getShopId(shopId: string) {
  try {
    const shop = await prisma.shops.findMany({
      where: {
        id: shopId,
      },
    });
    if (shop) {
      return shop[0];
    } else return null;
  } catch (error) {}
}

export const banShop = async (userId: string, banUnban: string) => {
  try {
    const currentRol: any = await prisma.users.findUnique({
      where: {
        userId,
      },
      select: {
        name: true,
        rol: true,
      },
    });
    if (currentRol.rol === 1 && banUnban === "ban") {
      const bannedShop = await prisma.users.update({
        where: {
          userId,
        },
        data: {
          rol: 3,
        },
      });
      return bannedShop;
    } else if (currentRol.rol === 3 && banUnban === "unban") {
      const unBannedShop = await prisma.users.update({
        where: {
          userId,
        },
        data: {
          rol: 1,
        },
      });
      return unBannedShop;
    }
    return currentRol;
  } catch (error) {
    return null;
  }
};

export const getShopDiscounts = async (shopId: string) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        shopId,
      },
      select: {
        discount: true,
      },
    });
    const arrayDiscount = products.map((e) => e.discount);
    const uniqueDiscount = arrayDiscount.filter(
      (value, index, self) => self.indexOf(value) === index
    );
    return uniqueDiscount.sort();
  } catch (error) {
    return null;
  }
};
