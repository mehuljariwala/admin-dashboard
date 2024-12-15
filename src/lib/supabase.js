import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Color Categories
export const getColorCategories = async () => {
  const { data, error } = await supabase
    .from("color_categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
};

export const addColorCategory = async (categoryData) => {
  const { data, error } = await supabase
    .from("color_categories")
    .insert([categoryData])
    .select();

  if (error) throw error;
  return data[0];
};

// Color Subcategories
export const getColorSubcategories = async () => {
  const { data, error } = await supabase
    .from("color_subcategories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
};

export const addColorSubcategory = async (subcategoryData) => {
  const { data, error } = await supabase
    .from("color_subcategories")
    .insert([subcategoryData])
    .select();

  if (error) throw error;
  return data[0];
};

// Colors
export const getColors = async () => {
  const { data, error } = await supabase
    .from("colors")
    .select(
      `
      *,
      category:color_categories(
        id,
        name
      ),
      subcategory:color_subcategories(
        id,
        name,
        category_id
      )
    `
    )
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
};

export const addColor = async (colorData) => {
  const { data, error } = await supabase
    .from("colors")
    .insert([
      {
        ...colorData,
        min_stock: colorData.min_stock || 0,
        max_stock: colorData.max_stock || 100,
        color_code: colorData.color_code || "#000000",
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateColor = async (id, updates) => {
  const { data, error } = await supabase
    .from("colors")
    .update({
      ...updates,
      min_stock: updates.min_stock || 0,
      max_stock: updates.max_stock || 100,
      color_code: updates.color_code || "#000000",
    })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

export const updateColorStock = async (id, stock) => {
  const { data, error } = await supabase
    .from("colors")
    .update({ stock })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteColor = async (id) => {
  const { error } = await supabase.from("colors").delete().eq("id", id);

  if (error) throw error;
};

// Parties
export const getParties = async () => {
  const { data, error } = await supabase
    .from("parties")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
};

export const addParty = async (partyData) => {
  const { data, error } = await supabase
    .from("parties")
    .insert([partyData])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateParty = async (id, updates) => {
  const { data, error } = await supabase
    .from("parties")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteParty = async (id) => {
  const { error } = await supabase.from("parties").delete().eq("id", id);

  if (error) throw error;
};

// Orders
export const getOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      party:parties(name, address),
      order_items:order_items(
        quantity,
        color:colors(name, code, category:color_categories(name))
      )
    `
    )
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
};

export const addOrder = async (orderData, orderItems) => {
  // Start a transaction
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([orderData])
    .select()
    .single();

  if (orderError) throw orderError;

  // Add items with the order_id
  const itemsWithOrderId = orderItems.map((item) => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsWithOrderId);

  if (itemsError) throw itemsError;

  return order;
};

export const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteOrder = async (id) => {
  // First delete related order items
  const { error: itemsError } = await supabase
    .from("order_items")
    .delete()
    .eq("order_id", id);

  if (itemsError) throw itemsError;

  // Then delete the order
  const { error: orderError } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (orderError) throw orderError;
};

// Routes
export const getRoutes = async () => {
  const { data, error } = await supabase
    .from("routes")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
};

export const addRoute = async (routeData) => {
  const { data, error } = await supabase
    .from("routes")
    .insert([routeData])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateRoute = async (id, updates) => {
  const { data, error } = await supabase
    .from("routes")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteRoute = async (id) => {
  const { error } = await supabase.from("routes").delete().eq("id", id);

  if (error) throw error;
};

// Inventory Transactions
export const getInventoryTransactions = async () => {
  const { data, error } = await supabase
    .from("inventory_transactions")
    .select(
      `
      *,
      color:colors(name)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const addInventoryTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from("inventory_transactions")
    .insert([transactionData])
    .select();

  if (error) throw error;

  // Update color stock
  const { data: color } = await supabase
    .from("colors")
    .select("stock")
    .eq("id", transactionData.color_id)
    .single();

  const newStock =
    color.stock +
    (transactionData.transaction_type === "IN"
      ? transactionData.quantity
      : -transactionData.quantity);

  await updateColorStock(transactionData.color_id, newStock);

  return data[0];
};

// Sub Admins
export const getSubAdmins = async () => {
  const { data, error } = await supabase
    .from("sub_admins")
    .select("*")
    .order("username", { ascending: true });

  if (error) throw error;
  return data;
};

export const addSubAdmin = async (adminData) => {
  const { data, error } = await supabase
    .from("sub_admins")
    .insert([adminData])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateSubAdmin = async (id, updates) => {
  const { data, error } = await supabase
    .from("sub_admins")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteSubAdmin = async (id) => {
  const { error } = await supabase.from("sub_admins").delete().eq("id", id);

  if (error) throw error;
};

export const updateSubAdminPermissions = async (id, permissions) => {
  const { data, error } = await supabase
    .from("sub_admins")
    .update({ permissions })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};
