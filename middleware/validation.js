exports.validateOrder = (req, res, next) => {
    // Basic validation for orders
    const { items, shipping_address } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }
    
    if (!shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }
    
    next();
  };
  
  exports.validateProduct = (req, res, next) => {
    // Basic validation for products
    const { name, price } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }
    
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid product price is required'
      });
    }
    
    next();
  };
  