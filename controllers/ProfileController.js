module.exports = {
  getProfile: async (req, res) => {
    try {
      // Placeholder profile response
      return res.status(200).json({ message: 'User profile route active' });
    } catch (err) {
      console.error('Profile fetch error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
