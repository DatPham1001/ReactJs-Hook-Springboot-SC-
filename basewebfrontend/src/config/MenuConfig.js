import {
  FcDepartment,
  FcManager,
  FcViewDetails,
  FcPackage,
} from "react-icons/fc";
import React from "react";
import { buildMapPathMenu } from "../utils/MenuUtils";

import { product } from "./menuconfig/Product";
import { order } from "./menuconfig/Order";
import { supplier } from "./menuconfig/Supplier";
import { user } from "./menuconfig/User";

export const MENU_LIST = [];

MENU_LIST.push(order);
MENU_LIST.push(product);
MENU_LIST.push(supplier);
MENU_LIST.push(user);

export const menuIconMap = new Map();

menuIconMap.set("PersonIcon", <FcManager size={24} />);
menuIconMap.set("OrderIcon", <FcViewDetails size={24} />);
menuIconMap.set("SupplierIcon", <FcDepartment size={24} />);
menuIconMap.set("ProductIcon", <FcPackage size={24} />);

export const mapPathMenu = buildMapPathMenu(MENU_LIST);
