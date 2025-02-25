const Transaction = require('../models/Transaction');

exports.initiateTransaction = async (req, res) => {
  const { kioskId, item, amount } = req.body;
  try {
    const transaction = new Transaction({
      user: req.user.id,
      kioskId,
      item,
      amount
    });
    await transaction.save();
    // (Optional) If integrating with Razorpay Orders, you can create an order here and attach the order ID
    res.status(201).json({ transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.confirmPayment = async (req, res) => {
  const { transactionId } = req.body;
  try {
    let transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    transaction.status = 'completed';
    await transaction.save();
    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
