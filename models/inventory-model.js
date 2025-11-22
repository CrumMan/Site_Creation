const pool = require("../database/")


/* ***************************
*  Get all classification data
* ************************** */
async function getClassifications() {
  const data = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
  return data.rows
}



/* ***************************
*  Get all inventory items and classification_name by classification_id
* ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      where inv_id = $1`,
      [inventory_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function registerVehicle(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id){
  try {
    const inv_image = `images/vehicles/${inv_model}.jpg`
    const inv_thumbnail = `images/vehicles/${inv_model}-tn.jpg`
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail,classification_id])
  } catch (error) {
    return error.message
  }
}


// Get all whole inventory function
async function getWholeInventory(){
  const data = await pool.query(
    `SELECT * from public.inventory as i
    ORDER BY inv_make, inv_model
    `
  )
  return data.rows
}



module.exports = {
  getClassifications, 
  getInventoryByClassificationId,
  getByInventoryId,
  registerVehicle,
  getWholeInventory
}