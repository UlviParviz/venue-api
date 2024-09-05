export default (user, statusCode, res) => {
  const token = user.getJwtToken();

  res.status(statusCode)
    .set("Authorization", `Bearer ${token}`)
    .json({ token });
};
